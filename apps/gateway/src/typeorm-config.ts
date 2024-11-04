import { Configuration } from '@repo/config';
import typeormOptions from './common/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';
import { DefaultConfigLoaderService } from '@repo/config';

if (process.env.NODE_ENV === 'test') {
  const oldQuery = PostgresQueryRunner.prototype['query'];
  PostgresQueryRunner.prototype['query'] = function (this, query, params, usr) {
    if (query.startsWith('CREATE TABLE')) {
      query = 'CREATE UNLOGGED TABLE' + query.substring(12);
    }
    return oldQuery.call(this, query, params, usr);
  };
}

function getDatabaseConfigs() {
  const defaultConfigLoader = new DefaultConfigLoaderService('config.yml');
  const defaultConfig = defaultConfigLoader.getMappedConfig<Configuration>();
  const configInstance = plainToInstance(Configuration, defaultConfig);
  configInstance.validate();
  return configInstance;
}

export const ds = new DataSource({ ...getDatabaseConfigs().database, ...typeormOptions });
