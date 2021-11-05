import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { file } from './entities/image.entity';

export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  // host: 'ec2-34-226-18-183.compute-1.amazonaws.com',
  url: 'postgres://lylhgqxjlyymdz:ac02afa0d350840cdee62854bcf15692775cb1af64eef5d58de4a0ad54173617@ec2-34-226-18-183.compute-1.amazonaws.com:5432/dflmkt5n2ckeck',
  // database: 'dflmkt5n2ckeck',
  // port: 5432,
  // username: 'lylhgqxjlyymdz',
  // password: 'ac02afa0d350840cdee62854bcf15692775cb1af64eef5d58de4a0ad54173617',
  entities: [file],
  synchronize: true,
};
