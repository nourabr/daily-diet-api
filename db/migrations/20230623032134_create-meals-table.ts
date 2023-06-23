import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('user_id').notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.string('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('on_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
