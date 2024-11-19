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
        await queryRunner.dropTable('currency');
    }
}
