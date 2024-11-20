import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Watches1732075516801 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'watch',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'name',
                type: 'varchar',
              },
              {
                name: 'brandId',
                type: 'uuid',
                isNullable: true,
              },
              {
                name: 'referenceNumber',
                type: 'varchar',
                isUnique: true,
              },
              {
                name: 'retailPrice',
                type: 'bigint',
              },
              {
                name: 'currencyId',
                type: 'uuid',
                isNullable: true,
              },
              {
                name: 'releaseDate',
                type: 'date',
              },
              {
                name: 'countryId',
                type: 'uuid',
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
                columnNames: ['brandId'],
                referencedTableName: 'brand',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
              },
              {
                columnNames: ['currencyId'],
                referencedTableName: 'currency',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
              },
              {
                columnNames: ['countryId'],
                referencedTableName: 'country',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
              },
            ],
          })
        );
      }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('watch');
    }
}
