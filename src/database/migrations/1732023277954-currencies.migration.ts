import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Currency1732023277954 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
            name: 'currency',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '10',
                    isUnique: true,
                },
                {
                    name: 'countryId',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    length: '10',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
            foreignKeys: [
                {
                columnNames: ['countryId'],
                referencedTableName: 'country',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                },
            ],
            }),
            true,
        );
        }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key first
        const table = await queryRunner.getTable('currency');
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('currencyId') !== -1
        );
        await queryRunner.dropForeignKey('currency', foreignKey);

        // Drop the currency table
        await queryRunner.dropTable('currency');
    }
}
