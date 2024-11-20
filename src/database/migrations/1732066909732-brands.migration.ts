import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Brands1732066909732 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the brands table
        await queryRunner.createTable(
          new Table({
            name: 'brand',
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
                isNullable: false,
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
              {
                name: 'deletedAt',
                type: 'timestamp',
                isNullable: true,
              },
            ],
            foreignKeys: [
                {
                    columnNames: ['countryId'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'country',
                    onDelete: 'SET NULL',
                }
            ],
          }),
          true,
        );
      }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key first
        const table = await queryRunner.getTable('brand');
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('countryId') !== -1
        );
        await queryRunner.dropForeignKey('brand', foreignKey);

        // Drop the brands table
        await queryRunner.dropTable('brand');
    }

}
