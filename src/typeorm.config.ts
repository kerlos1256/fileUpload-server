import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { file } from './entities/image.entity';

export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  // url: process.env.DATABASE_URL,
  host: 'localhost',
  database: 'image-upload',
  port: 5432,
  username: 'postgres',
  password: '123456',
  entities: [file],
  synchronize: true,
};
