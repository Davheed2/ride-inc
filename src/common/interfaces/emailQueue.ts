export interface CommonDataFields {
	to: string;
	priority: string;
}

export interface OtpEmailData extends CommonDataFields {
	name: string;
	otp: string;
}

export interface ForgotPasswordData extends CommonDataFields {
	resetLink: string;
	name: string;
}

export interface ResetPasswordData extends CommonDataFields {
	name: string;
}

export type EmailJobData =
//  | { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'otpEmail'; data: OtpEmailData }
	| { type: 'forgotPassword'; data: ForgotPasswordData }
	| { type: 'resetPassword'; data: ResetPasswordData };
