import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	extractTokenFamily,
	generateOtp,
	generateRandomString,
	generateTokenPair,
	getRefreshTokenFromRequest,
	invalidateTokenFamily,
	invalidateUserTokenFamilies,
	parseTokenDuration,
	sendOtpEmail,
	setCookie,
	toJSON,
	uploadPictureFile,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/modules/user/repository';
import { AuthProvider, Role } from '@/common/constants';
import { DateTime } from 'luxon';
import { ENVIRONMENT } from '@/common/config';
import axios from 'axios';
import { IUser, IUserGoogle } from '@/common/interfaces';

export class UserController {
	signUp = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName, lastName, phone, role } = req.body;

		if (!email && !phone) {
			throw new AppError('Either email or phone number is required', 400);
		}

		if (email) {
			const existingEmailUser = await userRepository.findByEmail(email);
			if (existingEmailUser) {
				throw new AppError('User with this email already exists', 409);
			}
		}

		if (phone) {
			const existingPhoneUser = await userRepository.findByPhone(phone);
			if (existingPhoneUser) {
				throw new AppError('User with this phone number already exists', 409);
			}
		}

		const isRegistrationComplete = !!(email && firstName && lastName && phone);

		const [user] = await userRepository.create({
			email,
			firstName,
			lastName,
			phone,
			ipAddress: req.ip,
			role: role === 'admin' ? Role.Admin : Role.User,
			authProvider: AuthProvider.Local,
			isRegistrationComplete,
		});
		if (!user) {
			throw new AppError('Failed to create user', 500);
		}

		return AppResponse(res, 201, toJSON([user]), 'User created successfully');
	});

	sendOtp = catchAsync(async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) {
			throw new AppError('Email is required', 400);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!user.email) {
			throw new AppError('No email address associated with this user', 400);
		}
		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (user.isDeleted) {
			throw new AppError('Account not found', 404);
		}

		const currentRequestTime = DateTime.now();
		const lastOtpRetry = user.lastLogin
			? currentRequestTime.diff(DateTime.fromISO(user.lastLogin.toISOString()), 'hours')
			: null;
		if (user.otpRetries >= 5 && lastOtpRetry && Math.round(lastOtpRetry.hours) < 1) {
			throw new AppError('Too many OTP requests. Please try again in an hour.', 429);
		}

		const generatedOtp = generateOtp();
		console.log('Generated OTP:', generatedOtp);
		const otpExpires = currentRequestTime.plus({ minutes: 5 }).toJSDate();

		await userRepository.update(user.id, {
			otp: generatedOtp,
			otpExpires,
			otpRetries: (user.otpRetries || 0) + 1,
		});

		await sendOtpEmail(user.email, user.firstName, generatedOtp);
		console.log(`OTP sent to ${user.email}: ${generatedOtp}`);

		return AppResponse(res, 200, null, `OTP sent. Please verify to continue.`);
	});

	verifyOtp = catchAsync(async (req: Request, res: Response) => {
		const { email, otp } = req.body;

		if (!email || !otp) {
			throw new AppError('Email and OTP are required', 400);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}

		const currentRequestTime = DateTime.now();

		if (
			!user.otp ||
			!user.otpExpires ||
			user.otp !== otp ||
			DateTime.fromJSDate(user.otpExpires) < currentRequestTime
		) {
			throw new AppError('Invalid or expired OTP', 401);
		}

		await userRepository.update(user.id, {
			otp: '',
			otpExpires: currentRequestTime.toJSDate(),
			otpRetries: 0,
			lastLogin: currentRequestTime.toJSDate(),
		});

		const updatedUser = await userRepository.findById(user.id);
		if (!updatedUser) {
			throw new AppError('Failed to retrieve updated user', 500);
		}

		const { accessToken, refreshToken } = await generateTokenPair(user.id);
		console.log('Access Token:', accessToken);
		console.log('Refresh Token:', refreshToken);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		return AppResponse(res, 200, toJSON([user]), 'OTP verified successfully');
	});

	signIn = catchAsync(async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) {
			throw new AppError('Incomplete login data', 401);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}

		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (user.isDeleted) {
			throw new AppError('Account not found', 404);
		}
		if (!user.isRegistrationComplete) {
			return AppResponse(res, 200, toJSON([user]), 'Please complete your registration to sign in.');
		}

		return AppResponse(res, 200, toJSON([user]), 'Please request OTP to complete sign in.');
	});

	googleOAuth = catchAsync(async (req: Request, res: Response) => {
		const { code } = req.body;

		if (!code) {
			throw new AppError('Authorization code is required', 400);
		}

		// Exchange code for tokens
		const tokenResponse = await axios.post(
			'https://oauth2.googleapis.com/token',
			new URLSearchParams({
				client_id: ENVIRONMENT.GOOGLE.CLIENT_ID,
				client_secret: ENVIRONMENT.GOOGLE.CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: ENVIRONMENT.GOOGLE.REDIRECT_URI,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					rideinc: true,
				},
			}
		);

		const tokens = tokenResponse.data as { access_token: string; [key: string]: unknown };

		// Get user info from Google
		const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		});

		const googleUser = userInfoResponse.data as IUserGoogle;
		if (!googleUser.email) {
			throw new AppError('Google account has no email associated', 400);
		}

		let user = await userRepository.findByEmail(googleUser.email);
		const currentTime = DateTime.now();

		if (!user) {
			[user] = await userRepository.create({
				email: googleUser.email,
				firstName: googleUser.given_name || '',
				lastName: googleUser.family_name || '',
				googleId: googleUser.id,
				authProvider: AuthProvider.Google,
			});
		} else {
			if (user.isSuspended) {
				throw new AppError('Your account is currently suspended', 401);
			}
			if (user.isDeleted) {
				throw new AppError('Account not found', 404);
			}

			await userRepository.update(user.id, {
				firstName: googleUser.given_name || user.firstName,
				lastName: googleUser.family_name || user.lastName,
				googleId: googleUser.id,
				lastLogin: currentTime.toJSDate(),
			});
		}

		if (!user) {
			throw new AppError('User not found', 404);
		}
		const { accessToken, refreshToken } = await generateTokenPair(user.id);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		return AppResponse(res, 200, toJSON([user]), 'Successfully authenticated with Google');
	});

	getGoogleAuthUrl = catchAsync(async (req: Request, res: Response) => {
		const state = generateRandomString();

		const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
		authUrl.searchParams.set('client_id', ENVIRONMENT.GOOGLE.CLIENT_ID);
		authUrl.searchParams.set('redirect_uri', ENVIRONMENT.GOOGLE.REDIRECT_URI);
		authUrl.searchParams.set('response_type', 'code');
		authUrl.searchParams.set('scope', 'openid email profile');
		authUrl.searchParams.set('state', state);
		authUrl.searchParams.set('access_type', 'offline');
		authUrl.searchParams.set('prompt', 'consent');

		return AppResponse(res, 200, { authUrl: authUrl.toString(), state }, 'Google auth URL generated');
	});

	signOut = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('You are not logged in', 401);
		}

		const refreshToken = getRefreshTokenFromRequest(req);

		if (refreshToken) {
			const tokenFamily = extractTokenFamily(refreshToken);
			if (tokenFamily) {
				await invalidateTokenFamily(tokenFamily);
				console.log(`Invalidated token family: ${tokenFamily} for user: ${user.id}`);
			}
		}

		setCookie(req, res, 'accessToken', 'expired', -1);
		setCookie(req, res, 'refreshToken', 'expired', -1);

		AppResponse(res, 200, null, 'Logout successful');
	});

	signOutFromAllDevices = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('You are not logged in', 401);
		}

		//clearing the cookies set on the frontend by setting a new cookie with empty values and an expiry time in the past
		setCookie(req, res, 'accessToken', 'expired', -1);
		setCookie(req, res, 'refreshToken', 'expired', -1);

		await invalidateUserTokenFamilies(user.id);

		AppResponse(res, 200, null, 'Logout from all devices successful');
	});

	getProfile = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const extinguishUser = await userRepository.findById(user.id);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		return AppResponse(res, 200, toJSON([extinguishUser]), 'Profile retrieved successfully');
	});

	updateUserDetails = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { email, firstName, lastName, phone, location, isNotificationEnabled } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const extinguishUser = await userRepository.findById(user.id);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		if (extinguishUser.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (extinguishUser.isDeleted) {
			throw new AppError('Account not found', 404);
		}

		if (email && email !== extinguishUser.email) {
			const existingEmailUser = await userRepository.findByEmail(email);
			if (existingEmailUser && existingEmailUser.id !== extinguishUser.id) {
				throw new AppError('User with this email already exists', 409);
			}
		}

		if (phone && phone !== extinguishUser.phone) {
			const existingPhoneUser = await userRepository.findByPhone(phone);
			if (existingPhoneUser && existingPhoneUser.id !== extinguishUser.id) {
				throw new AppError('User with this phone number already exists', 409);
			}
		}

		const updateData: Partial<IUser> = {};
		if (email !== undefined) updateData.email = email;
		if (firstName !== undefined) updateData.firstName = firstName;
		if (lastName !== undefined) updateData.lastName = lastName;
		if (phone !== undefined) updateData.phone = phone;
		if (location !== undefined) updateData.location = location;
		if (isNotificationEnabled !== undefined) updateData.isNotificationEnabled = isNotificationEnabled;

		const updatedUser = { ...user, ...updateData };
		const willBeComplete = !!(updatedUser.email && updatedUser.firstName && updatedUser.lastName && updatedUser.phone);

		if (willBeComplete) {
			updateData.isRegistrationComplete = true;
		}

		const updateUser = await userRepository.update(extinguishUser.id, updateData);
		if (!updateUser) {
			throw new AppError('Failed to update user details', 500);
		}

		const freshUser = await userRepository.findById(extinguishUser.id);
		if (!freshUser) {
			throw new AppError('Failed to retrieve updated user', 500);
		}

		return AppResponse(
			res,
			200,
			toJSON([freshUser]),
			willBeComplete ? 'Profile completed successfully' : 'Profile updated successfully'
		);
	});

	uploadProfilePicture = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!file) {
			throw new AppError('File is required', 400);
		}

		const extinguishUser = await userRepository.findById(user.id);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const { secureUrl } = await uploadPictureFile({
			fileName: `profile-picture/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const updateProfile = await userRepository.update(user.id, {
			photo: secureUrl,
		});
		if (!updateProfile) {
			throw new AppError('Failed to update profile picture', 500);
		}

		return AppResponse(res, 200, toJSON(updateProfile), 'Profile picture updated successfully');
	});

	// getAllUsers = catchAsync(async (req: Request, res: Response) => {
	// 	const { user } = req;

	// 	if (!user) {
	// 		throw new AppError('Please log in again', 401);
	// 	}

	// 	if (user.role === 'user') {
	// 		throw new AppError('Only admins can view all users', 403);
	// 	}

	// 	const extinguishUsers = await userRepository.findAll();
	// 	if (!extinguishUsers) {
	// 		throw new AppError('No users found', 404);
	// 	}

	// 	return AppResponse(res, 200, toJSON(extinguishUsers), 'Users retrieved successfully');
	// });

	// makeAdmin = catchAsync(async (req: Request, res: Response) => {
	// 	const { user } = req;
	// 	const { makeAdmin, userId } = req.body;

	// 	if (!user) {
	// 		throw new AppError('Please log in again', 401);
	// 	}
	// 	if (user.role === 'user') {
	// 		throw new AppError('Only admins can assign admin roles', 403);
	// 	}
	// 	if (user.id === userId) {
	// 		throw new AppError('You cant perform this operation on your account', 403);
	// 	}

	// 	const extinguishUser = await userRepository.findById(userId);
	// 	if (!extinguishUser) {
	// 		throw new AppError('User not found', 404);
	// 	}

	// 	const suspendUser = await userRepository.update(userId, {
	// 		role: makeAdmin ? Role.Admin : Role.User,
	// 	});
	// 	if (!suspendUser) {
	// 		throw new AppError(`Failed to ${makeAdmin ? 'promote' : 'demote'} user`, 500);
	// 	}

	// 	return AppResponse(res, 200, null, `User ${makeAdmin ? 'promoted' : 'demoted'} successfully`);
	// });
}

export const userController = new UserController();

// // Facebook OAuth Sign In/Up (Combined endpoint)
// facebookOAuth = catchAsync(async (req: Request, res: Response) => {
//     const { code, state } = req.body;

//     if (!code) {
//         throw new AppError('Authorization code is required', 400);
//     }

//     try {
//         // Exchange code for access token
//         const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 client_id: ENVIRONMENT.FACEBOOK_APP_ID,
//                 client_secret: ENVIRONMENT.FACEBOOK_APP_SECRET,
//                 code,
//                 redirect_uri: ENVIRONMENT.FACEBOOK_REDIRECT_URI,
//             }),
//         });

//         if (!tokenResponse.ok) {
//             throw new AppError('Failed to exchange code for tokens', 401);
//         }

//         const tokens = await tokenResponse.json();

//         if (tokens.error) {
//             throw new AppError(`Facebook OAuth error: ${tokens.error.message}`, 401);
//         }

//         // Get user info from Facebook
//         const userInfoResponse = await fetch(
//             `https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name,picture.type(large)&access_token=${tokens.access_token}`
//         );

//         if (!userInfoResponse.ok) {
//             throw new AppError('Failed to get user information', 401);
//         }

//         const facebookUser = await userInfoResponse.json();

//         if (facebookUser.error) {
//             throw new AppError(`Facebook API error: ${facebookUser.error.message}`, 401);
//         }

//         // Facebook doesn't always provide email, handle this case
//         if (!facebookUser.email) {
//             throw new AppError('Email permission is required. Please allow email access and try again.', 400);
//         }

//         // Check if user exists
//         let user = await userRepository.findByEmail(facebookUser.email);

//         const currentTime = DateTime.now();

//         if (!user) {
//             // Create new user (Sign Up)
//             user = await userRepository.create({
//                 email: facebookUser.email,
//                 firstName: facebookUser.first_name || '',
//                 lastName: facebookUser.last_name || '',
//                 profilePicture: facebookUser.picture?.data?.url || '',
//                 facebookId: facebookUser.id,
//                 isEmailVerified: true, // Facebook emails are typically verified
//                 createdAt: currentTime.toJSDate(),
//                 lastLogin: currentTime.toJSDate(),
//                 authProvider: 'facebook',
//             });
//         } else {
//             // User exists, check account status
//             if (user.isSuspended) {
//                 throw new AppError('Your account is currently suspended', 401);
//             }
//             if (user.isDeleted) {
//                 throw new AppError('Account not found', 404);
//             }

//             // Update user info and last login
//             await userRepository.update(user.id, {
//                 firstName: facebookUser.first_name || user.firstName,
//                 lastName: facebookUser.last_name || user.lastName,
//                 profilePicture: facebookUser.picture?.data?.url || user.profilePicture,
//                 facebookId: facebookUser.id,
//                 isEmailVerified: true,
//                 lastLogin: currentTime.toJSDate(),
//             });
//         }

//         // Generate tokens
//         const { accessToken, refreshToken } = await generateTokenPair(user.id);

//         // Set cookies
//         setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
//         setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

//         return AppResponse(res, 200, toJSON([user]), 'Successfully authenticated with Facebook');

//     } catch (error) {
//         console.error('Facebook OAuth error:', error);
//         throw new AppError('Authentication failed', 401);
//     }
// });

// // Optional: Generate Facebook OAuth URL (for frontend to redirect to)
// getFacebookAuthUrl = catchAsync(async (req: Request, res: Response) => {
//     const state = generateRandomString(32); // Generate random state for security

//     const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
//     authUrl.searchParams.set('client_id', ENVIRONMENT.FACEBOOK_APP_ID);
//     authUrl.searchParams.set('redirect_uri', ENVIRONMENT.FACEBOOK_REDIRECT_URI);
//     authUrl.searchParams.set('response_type', 'code');
//     authUrl.searchParams.set('scope', 'email,public_profile');
//     authUrl.searchParams.set('state', state);

//     return AppResponse(res, 200, { authUrl: authUrl.toString(), state }, 'Facebook auth URL generated');
// });

// // Alternative: Handle Facebook SDK Login (for client-side Facebook SDK)
// facebookSdkOAuth = catchAsync(async (req: Request, res: Response) => {
//     const { accessToken } = req.body;

//     if (!accessToken) {
//         throw new AppError('Facebook access token is required', 400);
//     }

//     try {
//         // Verify token with Facebook and get user info
//         const userInfoResponse = await fetch(
//             `https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name,picture.type(large)&access_token=${accessToken}`
//         );

//         if (!userInfoResponse.ok) {
//             throw new AppError('Invalid Facebook access token', 401);
//         }

//         const facebookUser = await userInfoResponse.json();

//         if (facebookUser.error) {
//             throw new AppError(`Facebook API error: ${facebookUser.error.message}`, 401);
//         }

//         if (!facebookUser.email) {
//             throw new AppError('Email permission is required. Please allow email access and try again.', 400);
//         }

//         // Rest of the logic is the same as above
//         let user = await userRepository.findByEmail(facebookUser.email);
//         const currentTime = DateTime.now();

//         if (!user) {
//             user = await userRepository.create({
//                 email: facebookUser.email,
//                 firstName: facebookUser.first_name || '',
//                 lastName: facebookUser.last_name || '',
//                 profilePicture: facebookUser.picture?.data?.url || '',
//                 facebookId: facebookUser.id,
//                 isEmailVerified: true,
//                 createdAt: currentTime.toJSDate(),
//                 lastLogin: currentTime.toJSDate(),
//                 authProvider: 'facebook',
//             });
//         } else {
//             if (user.isSuspended) {
//                 throw new AppError('Your account is currently suspended', 401);
//             }
//             if (user.isDeleted) {
//                 throw new AppError('Account not found', 404);
//             }

//             await userRepository.update(user.id, {
//                 firstName: facebookUser.first_name || user.firstName,
//                 lastName: facebookUser.last_name || user.lastName,
//                 profilePicture: facebookUser.picture?.data?.url || user.profilePicture,
//                 facebookId: facebookUser.id,
//                 isEmailVerified: true,
//                 lastLogin: currentTime.toJSDate(),
//             });
//         }

//         const { accessToken: jwtAccessToken, refreshToken } = await generateTokenPair(user.id);

//         setCookie(req, res, 'accessToken', jwtAccessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
//         setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

//         return AppResponse(res, 200, toJSON([user]), 'Successfully authenticated with Facebook');

//     } catch (error) {
//         console.error('Facebook SDK OAuth error:', error);
//         throw new AppError('Authentication failed', 401);
//     }
// });
