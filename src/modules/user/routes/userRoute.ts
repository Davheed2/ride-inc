import { multerUpload } from '@/common/config';
import { userController } from '../controller';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

/**
 * @openapi
 * /sign-up:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details. Either an email or phone number is required. The endpoint checks for existing users with the same email or phone number and ensures the user is created with the appropriate role and registration status.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 nullable: true
 *                 example: "user@example.com"
 *                 description: The user's email address
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "08163534417"
 *                 description: The user's phone number
 *             required:
 *               - email
 *               - phone
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       otpRetries:
 *                         type: integer
 *                         example: 0
 *                         description: Number of OTP retry attempts
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       authProvider:
 *                         type: string
 *                         example: "local"
 *                         description: The authentication provider used
 *                       googleId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's Google ID, if applicable
 *                       isRegistrationComplete:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user registration is complete
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad Request - Either email or phone number is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Either email or phone number is required"
 *       409:
 *         description: Conflict - User with the provided email or phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 *       500:
 *         description: Internal Server Error - Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to create user"
 */
router.post('/sign-up', userController.signUp);
/**
 * @openapi
 * /sign-in:
 *   post:
 *     summary: Sign in a user with email
 *     description: Authenticates a user by email, checking if the user exists, is not suspended or deleted, and has completed registration. If successful, prompts the user to request an OTP to complete the sign-in process.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The user's email address
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Sign-in initiated successfully, OTP request required or registration incomplete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       otpRetries:
 *                         type: integer
 *                         example: 0
 *                         description: Number of OTP retry attempts
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       authProvider:
 *                         type: string
 *                         example: "local"
 *                         description: The authentication provider used
 *                       googleId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's Google ID, if applicable
 *                       isRegistrationComplete:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the user registration is complete
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's location
 *                       isNotificationEnabled:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if notifications are enabled for the user
 *                 message:
 *                   type: string
 *                   example: "Please request OTP to complete sign in."
 *       401:
 *         description: Unauthorized - Incomplete login data or account is suspended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Incomplete login data"
 *       404:
 *         description: Not Found - User or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.post('/sign-in', userController.signIn);
/**
 * @openapi
 * /send-otp:
 *   post:
 *     summary: Send OTP for user verification via email
 *     description: Sends a one-time password (OTP) to the user's email address. Validates the user's existence, email address, account status, and OTP request limits before sending the OTP.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The user's email address
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                   description: No data returned for this response
 *                 message:
 *                   type: string
 *                   example: "OTP sent. Please verify to continue."
 *                   description: Confirmation message indicating the OTP was sent
 *       400:
 *         description: Bad Request - Missing email or no email associated with user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Unauthorized - Account is suspended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Your account is currently suspended"
 *       404:
 *         description: Not Found - User or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       429:
 *         description: Too Many Requests - Exceeded OTP request limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Too many OTP requests. Please try again in an hour."
 */
router.post('/send-otp', userController.sendOtp);
/**
 * @openapi
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for user authentication via email
 *     description: Verifies the one-time password (OTP) provided by the user to complete the authentication process using their email. Checks the user's existence, validates the OTP, and ensures it is not expired. Upon successful verification, clears the OTP, generates access and refresh tokens, sets them as cookies, and updates user details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The user's email address
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: The one-time password sent to the user
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully, tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's location
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example:
 *                   - "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *                   - "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *               description: Sets the access and refresh tokens as cookies
 *       400:
 *         description: Bad Request - Missing email or OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Email and OTP are required"
 *       401:
 *         description: Unauthorized - Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired OTP"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error - Failed to retrieve updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve updated user"
 */
router.post('/verify-otp', userController.verifyOtp);

// OAuth
/**
 * @openapi
 * /auth/google/url:
 *   get:
 *     summary: Generate Google OAuth URL
 *     description: Generates a Google OAuth 2.0 authorization URL for user authentication based on the specified platform (web, expo, expo-dev, android, ios). The URL includes client ID, redirect URI, scope, and a unique state parameter for security. Returns the generated URL and related details.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [web, expo, expo-dev, android, ios]
 *           default: web
 *         description: The platform for which the Google OAuth URL is generated
 *     responses:
 *       200:
 *         description: Google auth URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     authUrl:
 *                       type: string
 *                       example: "https://accounts.google.com/o/oauth2/v2/auth?client_id=12345-abc.apps.googleusercontent.com&response_type=code&scope=openid%20email%20profile&state=xyz123&access_type=offline&prompt=consent&redirect_uri=https://example.com/callback"
 *                       description: The generated Google OAuth authorization URL
 *                     state:
 *                       type: string
 *                       example: "xyz123"
 *                       description: A unique state parameter for CSRF protection
 *                     platform:
 *                       type: string
 *                       example: "web"
 *                       description: The platform for which the URL was generated
 *                 message:
 *                   type: string
 *                   example: "Google auth URL generated"
 *       400:
 *         description: Bad Request - Invalid or missing platform
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Valid platform (web, expo, expo-dev, android, ios) is required"
 */
router.get('/auth/google/url', userController.getGoogleAuthUrl);
/**
 * @openapi
 * /auth/google:
 *   post:
 *     summary: Authenticate user with Google OAuth
 *     description: Authenticates a user using a Google OAuth authorization code. Validates the code and platform, exchanges the code for an access token, retrieves user information, and either creates a new user or updates an existing one. Generates access and refresh tokens, sets them as cookies, and returns user details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "4/0AX4XfWj..."
 *                 description: The Google OAuth authorization code
 *               platform:
 *                 type: string
 *                 enum: [web, expo, expo-dev, android, ios]
 *                 example: "web"
 *                 description: The platform for which the authentication is performed
 *             required:
 *               - code
 *               - platform
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: "https://lh3.googleusercontent.com/a-/AOh14Gh..."
 *                         description: URL of the user's profile picture from Google
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       googleId:
 *                         type: string
 *                         nullable: true
 *                         example: "123456789012345678901"
 *                         description: The user's Google ID
 *                       authProvider:
 *                         type: string
 *                         example: "google"
 *                         description: The authentication provider used
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                 message:
 *                   type: string
 *                   example: "Successfully authenticated with Google"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example:
 *                   - "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *                   - "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *               description: Sets the access and refresh tokens as cookies
 *       400:
 *         description: Bad Request - Missing or invalid authorization code, platform, or Google account has no email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Authorization code is required"
 *       401:
 *         description: Unauthorized - Account is suspended or email already registered with a different provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Your account is currently suspended"
 *       404:
 *         description: Not Found - User or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.post('/auth/google', userController.googleOAuth);

router.use(protect);
/**
 * @openapi
 * /sign-out:
 *   post:
 *     summary: Sign out a user
 *     description: Logs out the currently authenticated user by invalidating their token family (if a refresh token is provided) and clearing access and refresh token cookies. Requires the user to be authenticated.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                   description: No data returned for this response
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *                   description: Confirmation message indicating successful logout
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example:
 *                   - "accessToken=expired; Path=/; HttpOnly; Max-Age=-1"
 *                   - "refreshToken=expired; Path=/; HttpOnly; Max-Age=-1"
 *               description: Clears the access and refresh tokens by setting expired cookies
 *       401:
 *         description: Unauthorized - User is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "You are not logged in"
 */
router.post('/sign-out', userController.signOut);
/**
 * @openapi
 * /sign-out-all:
 *   post:
 *     summary: Sign out user from all devices
 *     description: Logs out the currently authenticated user from all devices by invalidating all token families associated with the user and clearing access and refresh token cookies. Requires the user to be authenticated.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Logout from all devices successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                   description: No data returned for this response
 *                 message:
 *                   type: string
 *                   example: "Logout from all devices successful"
 *                   description: Confirmation message indicating successful logout from all devices
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example:
 *                   - "accessToken=expired; Path=/; HttpOnly; Max-Age=-1"
 *                   - "refreshToken=expired; Path=/; HttpOnly; Max-Age=-1"
 *               description: Clears the access and refresh tokens by setting expired cookies
 *       401:
 *         description: Unauthorized - User is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "You are not logged in"
 */
router.post('/sign-out-all', userController.signOutFromAllDevices);
/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Retrieve user profile
 *     description: Retrieves the profile information of the currently authenticated user. The endpoint validates the user's authentication, checks if the user exists in the database, and returns their profile details.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       otpRetries:
 *                         type: integer
 *                         example: 0
 *                         description: Number of OTP retry attempts
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       authProvider:
 *                         type: string
 *                         example: "local"
 *                         description: The authentication provider used
 *                       googleId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The user's Google ID, if applicable
 *                       isRegistrationComplete:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the user registration is complete
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *       400:
 *         description: Bad Request - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/profile', userController.getProfile);
/**
 * @openapi
 * /update-user:
 *   put:
 *     summary: Update authenticated user details
 *     description: Updates the details of the currently authenticated user. Validates the user's existence, checks for account suspension or deletion, and ensures that the updated email or phone number does not already exist for another user. The registration completion status is updated if all required fields are provided.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 nullable: true
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The user's email address
 *               firstName:
 *                 type: string
 *                 nullable: true
 *                 example: "John"
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 nullable: true
 *                 example: "David"
 *                 description: The user's last name
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "08163534417"
 *                 description: The user's phone number
 *               location:
 *                 type: string
 *                 nullable: true
 *                 example: "Lagos"
 *                 description: The user's location
 *               isNotificationEnabled:
 *                 type: boolean
 *                 nullable: true
 *                 example: true
 *                 description: Indicates if notifications are enabled for the user
 *     responses:
 *       200:
 *         description: Profile updated or completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "John"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: "Lagos"
 *                         description: The user's location
 *                 message:
 *                   type: string
 *                   example: "Profile completed successfully"
 *       400:
 *         description: Bad Request - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Please log in again"
 *       401:
 *         description: Unauthorized - Account is suspended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Your account is currently suspended"
 *       404:
 *         description: Not Found - User or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       409:
 *         description: Conflict - User with the provided email or phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 *       500:
 *         description: Internal Server Error - Failed to update or retrieve user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to update user details"
 */
router.post('/update-user', userController.updateUserDetails);
/**
 * @openapi
 * /upload-profile-picture:
 *   post:
 *     summary: Upload user profile picture
 *     description: Uploads a profile picture for the currently authenticated user. Validates user authentication, checks for the existence of the user, and ensures a file is provided. The file is uploaded to a storage service, and the user's profile is updated with the secure URL of the uploaded image.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload
 *             required:
 *               - file (photo: form-data key)
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: "uchennadavid2404@gmail.com"
 *                         description: The user's email address
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "08163534417"
 *                         description: The user's phone number
 *                       firstName:
 *                         type: string
 *                         nullable: true
 *                         example: "John"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/profile-picture/1758781131611-image 13.png"
 *                         description: URL of the user's profile picture
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user account is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: "Lagos"
 *                         description: The user's location
 *                 message:
 *                   type: string
 *                   example: "Profile picture updated successfully"
 *       400:
 *         description: Bad Request - User not logged in or file is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error - Failed to update profile picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to update profile picture"
 */
router.post('/upload-profile-picture', multerUpload.single('photo'), userController.uploadProfilePicture);
// router.get('/all', userController.getAllUsers);
// router.post('/suspend-user', userController.suspendUser);
// router.post('/make-admin', userController.makeAdmin);

export { router as userRouter };
