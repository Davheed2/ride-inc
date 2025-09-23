import { AuthProvider } from '../../../common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.enum('authProvider', Object.values(AuthProvider)).defaultTo(AuthProvider.Local);
		table.string('googleId').nullable().unique();
		table.boolean('isRegistrationComplete').defaultTo(false);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.dropColumn('authProvider');
		table.dropColumn('googleId');
		table.dropColumn('isRegistrationComplete');
	});
}
