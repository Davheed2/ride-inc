import { z } from 'zod';
import { nameZ, passwordZ, uuidZ } from '@/schemas/common';

export const userModuleSchema = z
	.object({
		firstName: nameZ.optional(),
		lastName: nameZ.optional(),
		email: z
			.string()
			.email()
			.optional()
			.transform((s) => s?.toLowerCase()),
		phone: z.string().optional(),
		password: passwordZ.optional(),
		oldPassword: passwordZ.optional(),
		newPassword: passwordZ.optional(),
		userId: uuidZ.optional(),
		otp: z.string().optional(),
		method: z.enum(['email', 'sms']).optional(),
		code: z.string().optional(),
	})
	.strict();

export type UserModuleInput = z.infer<typeof userModuleSchema>;
export default userModuleSchema;
