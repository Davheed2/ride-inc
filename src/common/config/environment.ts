import type { IEnvironment } from '@/common/interfaces';

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
		CLIENT: process.env.FRONTEND_URL!,
	},
	DB: {
		HOST: process.env.DB_HOST!,
		USER: process.env.DB_USER!,
		PASSWORD: process.env.DB_PASSWORD!,
		DATABASE: process.env.DB_DATABASE!,
		PORT: process.env.DB_PORT!,
	},
	JWT: {
		AUTH_SECRET: process.env.AUTH_SECRET!,
		ACCESS_SECRET: process.env.ACCESS_TOKEN!,
		REFRESH_SECRET: process.env.REFRESH_TOKEN!,
	},
	JWT_EXPIRES_IN: {
		ACCESS: process.env.ACCESS_TOKEN_EXPIRES_IN!,
		REFRESH: process.env.REFRESH_TOKEN_EXPIRES_IN!,
	},
	EMAIL: {
		GMAIL_USER: process.env.GMAIL_USER!,
		GMAIL_PASSWORD: process.env.GMAIL_PASSWORD!,
	},
	FRONTEND_URL: process.env.FRONTEND_URL!,
	R2: {
		ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
		REGION: process.env.R2_REGION || 'auto',
		ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
		SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
		BUCKET_NAME: process.env.R2_BUCKET_NAME!,
		CDN_URL: process.env.R2_CDN_URL!,
		PUBLIC_URL: process.env.R2_PUBLIC_URL!,
	},
	REDIS: {
		URL: process.env.QUEUE_REDIS_URL!,
		PASSWORD: process.env.QUEUE_REDIS_PASSWORD!,
		PORT: parseInt(process.env.QUEUE_REDIS_PORT!),
	},
	GOOGLE: {
		WEB_CLIENT_ID: process.env.WEB_CLIENT_ID!,
		WEB_CLIENT_SECRET: process.env.WEB_CLIENT_SECRET!,
		WEB_REDIRECT_URI: process.env.WEB_REDIRECT_URI!,
		ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID!,
		ANDROID_CLIENT_SECRET: process.env.ANDROID_CLIENT_SECRET!,
		ANDROID_REDIRECT_URI: process.env.ANDROID_REDIRECT_URI!,
		IOS_CLIENT_ID: process.env.IOS_CLIENT_ID!,
		IOS_CLIENT_SECRET: process.env.IOS_CLIENT_SECRET!,
		IOS_REDIRECT_URI: process.env.IOS_REDIRECT_URI!,
		EXPO_REDIRECT_URI: process.env.EXPO_REDIRECT_URI!,
	}
};
