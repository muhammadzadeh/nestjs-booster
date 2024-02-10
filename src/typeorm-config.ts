import { Configuration } from './common/config';
import typeormOptions from 'common/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';
import { DefaultConfigLoaderService } from './common/config/services';

if (process.env.NODE_ENV === 'test') {
  const oldQuery = PostgresQueryRunner.prototype['query'];
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  PostgresQueryRunner.prototype['query'] = function (this, query, params, usr) {
    if (query.startsWith('CREATE TABLE')) {
      query = 'CREATE UNLOGGED TABLE' + query.substring(12);
    }
    return oldQuery.call(this, query, params, usr);
  };
}

function getDatabaseConfigs() {
  const default_config_loader = new DefaultConfigLoaderService('config.yml');
  const default_config = default_config_loader.getMappedConfig<Configuration>();
  const config_instance = plainToInstance(Configuration, default_config);
  config_instance.validate();
  return config_instance;
}

export const ds = new DataSource({ ...getDatabaseConfigs().database, ...typeormOptions });
