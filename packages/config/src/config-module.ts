import { DynamicModule, FactoryProvider, Module, ModuleMetadata } from '@nestjs/common';
import { mergeObjects } from '@repo/utils';
import { plainToInstance } from 'class-transformer';
import * as VaultClient from 'node-vault';
import { Configuration } from './configuration';
import { DefaultConfigLoaderService, VaultService } from './services';

class ConfigOptions {
  filePath!: string;
}

export interface AsyncConfigOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ConfigOptions> | ConfigOptions;
  inject: FactoryProvider['inject'];
}

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class ConfigModule {
  static forRootAsync(options: AsyncConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      imports: options.imports || [],
      providers: [
        {
          inject: options.inject,
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
        },
        {
          provide: Configuration,
          useFactory: async (): Promise<Configuration> => {
            const configOptions: ConfigOptions = await options.useFactory(...options.inject!);
            const defaultConfigLoader = new DefaultConfigLoaderService(configOptions.filePath);

            const defaultConfig = defaultConfigLoader.getMappedConfig<Configuration>();
            const { vault: vaultConfig, app: appConfig } = defaultConfig;
            let mergedConfig = defaultConfig;

            if (vaultConfig) {
              const vaultClient = VaultClient.default({
                endpoint: vaultConfig.host,
                token: vaultConfig.token,
              });

              const defaultPath = `${vaultConfig.backend}/data/${appConfig.name}/${appConfig.env}`;
              const vaultService = new VaultService(vaultClient, defaultPath);
              const vaultStoredConfigs = await vaultService.read<Configuration>();

              mergedConfig = mergeObjects(defaultConfig, vaultStoredConfigs);
            }

            const configInstance = plainToInstance(Configuration, mergedConfig);

            configInstance.validate();

            return configInstance;
          },
        },
      ],
      exports: [Configuration],
    };
  }
}
