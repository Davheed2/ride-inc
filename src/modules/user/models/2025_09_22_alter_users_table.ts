import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.string('location').nullable().unique();
		table.boolean('isNotificationEnabled').defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.dropColumn('location');
		table.dropColumn('isNotificationEnabled');
	});
}
