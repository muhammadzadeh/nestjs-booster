import * as VaultClient from 'node-vault';
import NodeVault from 'node-vault';

export class VaultService {
  private readonly client: VaultClient.client;
  private readonly defaultPath: string;
  constructor(client: NodeVault.client, defaultPath: string) {
    this.client = client;
    this.defaultPath = defaultPath;
  }

  public getClient(): VaultClient.client {
    return this.client;
  }

  async read<T>(path?: string): Promise<T> {
    const { data: result } = await this.client!.read(path ? path : this.defaultPath);

    return result.data as T;
  }
}
