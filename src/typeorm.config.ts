import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { file } from './entities/image.entity';

export const typeOrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'database',
  entities: [file],
  synchronize: true,
};
