import { AuthProvider, Role } from '../constants';

export interface IUser {
	id: string;
	phone: string;
	firstName: string;
	lastName: string;
	email: string;
	ipAddress: string;
	otp: string;
	otpExpires: Date;
	photo: string;
	authProvider: AuthProvider;
	googleId?: string;
	location: string;
	isNotificationEnabled: boolean;
	role: Role;
	otpRetries: number;
	lastLogin: Date;
	isSuspended: boolean;
	isRegistrationComplete: boolean;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface IUserGoogle {
	email: string;
	picture?: string;
	given_name?: string;
	family_name?: string;
	id?: string;
}
