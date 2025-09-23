import { userController } from '../controller';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);
router.post('/update-user', userController.updateUserDetails);
router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);

// OAuth
router.get('/auth/google/url', userController.getGoogleAuthUrl);
router.post('/auth/google', userController.googleOAuth);

router.use(protect);
router.post('/sign-out', userController.signOut);
router.post('/sign-out-all', userController.signOutFromAllDevices);
router.get('/', userController.getProfile);
// router.get('/all', userController.getAllUsers);
// router.post('/suspend-user', userController.suspendUser);
// router.post('/make-admin', userController.makeAdmin);

export { router as userRouter };
