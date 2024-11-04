import { absoluteFromBase } from '@repo/utils';
import handlebars from 'handlebars';
import yaml from 'js-yaml';
import fs from 'node:fs';

export class DefaultConfigLoaderService {
  private readonly configData: any;
  private configContent: string;
  constructor(configFilePath: string) {
    this.configContent = this.loadFileConfig(configFilePath);
    this.applyEnvConfigs(yaml.load(this.configContent));
    this.configData = yaml.load(this.configContent);
  }

  private loadFileConfig(configFilePath: string) {
    const configAddress = absoluteFromBase(configFilePath);
    const content = fs.readFileSync(configAddress, { encoding: 'utf-8' });
    return handlebars.compile(content)(process.env);
  }

  private applyEnvConfigs(data: any) {
    const result: any = {};
    for (const prop in data) {
      if ({}.hasOwnProperty.call(data, prop)) {
        result[prop] = data[prop];
        if (typeof data[prop] === 'object') {
          result[prop] = this.applyEnvConfigs(data[prop]);
        } else {
          const envKey = data[prop];
          const envValue = process.env[`${envKey}`];
          if (envValue) this.configContent = this.configContent.replaceAll(envKey, envValue);
        }
      }
    }
    return result;
  }

  public getConfigData(): any {
    return this.configData;
  }

  public getMappedConfig<T>(): T {
    return this.getConfigData() as T;
  }
}
