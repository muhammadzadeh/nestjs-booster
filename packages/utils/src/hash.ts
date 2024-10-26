import { compare, genSaltSync, hashSync } from 'bcrypt';

export class Hash {
  static async makeAsync(data: string): Promise<string> {
    const salt = genSaltSync(10);
    return hashSync(data, salt);
  }

  static makeSync(data: string): string {
    const salt = genSaltSync(10);
    return hashSync(data, salt);
  }

  static async compare(data: string, encrypted: string): Promise<boolean> {
    return await compare(data, encrypted);
  }
}
