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
 *     summary: Sign in a user
 *     description: Authenticates a user by phone number, checking if the user exists, is not suspended or deleted, and has completed registration. If successful, prompts the user to request an OTP to complete the sign-in process.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "08163534417"
 *                 description: The user's phone number
 *             required:
 *               - phone
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
 * /update-user:
 *   post:
 *     summary: Update user details
 *     description: Updates the details of an existing user based on the provided user ID. The endpoint validates the user's existence, checks for account suspension or deletion, and ensures that the updated email or phone number does not already exist for another user. The registration completion status is updated if all required fields are provided.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "3515368b-1c83-4fcf-b301-7db17bb7d0de"
 *                 description: The unique identifier of the user
 *               email:
 *                 type: string
 *                 nullable: true
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The user's email address
 *               firstName:
 *                 type: string
 *                 nullable: true
 *                 example: "David"
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
 *             required:
 *               - userId
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
 *                         example: "David"
 *                         description: The user's first name
 *                       lastName:
 *                         type: string
 *                         nullable: true
 *                         example: "David"
 *                         description: The user's last name
 *                       otp:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: One-time password for user verification
 *                       otpExpires:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                         description: Expiry timestamp for the OTP
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       ipAddress:
 *                         type: string
 *                         example: "::1"
 *                         description: The IP address used during user registration
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
 *                       lastLogin:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp of the user's last login
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:33:18.332Z"
 *                         description: Timestamp when the user account was last updated
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
 *                   example: "Profile completed successfully"
 *       400:
 *         description: Bad Request - User ID is required
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
 *                   example: "User ID is required"
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
 * /send-otp:
 *   post:
 *     summary: Send OTP for user verification
 *     description: Sends a one-time password (OTP) to the user's phone number via the specified method (SMS or WhatsApp). Validates the user's existence, phone number, account status, and OTP request limits before sending the OTP.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "08163534417"
 *                 description: The user's phone number
 *               method:
 *                 type: string
 *                 enum: ["sms", "whatsapp"]
 *                 example: "sms"
 *                 description: The method to send the OTP (SMS or WhatsApp)
 *             required:
 *               - phone
 *               - method
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
 *                   example: "OTP sent via sms. Please verify to continue."
 *                   description: Confirmation message indicating the OTP was sent
 *       400:
 *         description: Bad Request - Missing or invalid phone number or verification method
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
 *                   example: "Phone number and verification method are required"
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
 *     summary: Verify OTP for user authentication
 *     description: Verifies the one-time password (OTP) provided by the user to complete the authentication process. Checks the user's existence, validates the OTP, and ensures it is not expired. Upon successful verification, generates access and refresh tokens, sets them as cookies, and updates user details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "08163534417"
 *                 description: The user's phone number
 *               otp:
 *                 type: string
 *                 example: "2222"
 *                 description: The one-time password sent to the user
 *             required:
 *               - phone
 *               - otp
 *     responses:
 *       200:
 *         description: Phone verified successfully, tokens generated
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
 *                       otp:
 *                         type: string
 *                         nullable: true
 *                         example: "2222"
 *                         description: The one-time password used for verification
 *                       otpExpires:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2025-10-23T03:37:32.171Z"
 *                         description: Expiry timestamp for the OTP
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL or path to the user's profile photo
 *                       role:
 *                         type: string
 *                         example: "user"
 *                         description: The user's role
 *                       ipAddress:
 *                         type: string
 *                         example: "::1"
 *                         description: The IP address used during user registration
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
 *                       lastLogin:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:40:07.155Z"
 *                         description: Timestamp of the user's last login
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:25:40.189Z"
 *                         description: Timestamp when the user account was created
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T03:40:07.174Z"
 *                         description: Timestamp when the user account was last updated
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
 *                   example: "Phone verified successfully"
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
 *         description: Bad Request - Missing phone number or OTP
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
 *                   example: "Phone number and OTP are required"
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
router.get('/auth/google/url', userController.getGoogleAuthUrl);
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
// router.get('/all', userController.getAllUsers);
// router.post('/suspend-user', userController.suspendUser);
// router.post('/make-admin', userController.makeAdmin);

export { router as userRouter };
