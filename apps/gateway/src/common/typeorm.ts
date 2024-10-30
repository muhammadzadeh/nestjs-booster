import path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const Config: Partial<PostgresConnectionOptions> = {
  entities: [path.join(__dirname, '..', '..', 'dist', '**', 'entities', '*.entity.js')],
  synchronize: false,
  migrations: [path.join(__dirname, '..', '..', 'dist', 'migration', '*.js')],
  migrationsRun: true,
};

export default Config;
