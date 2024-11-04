const characters: Record<string, string> = {
  'url-safe': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~',
  numeric: '0123456789',
  'memory-numeric': '123456789',
  distinguishable: 'CDEHKMPRTUWXY012458',
  'ascii-printable': '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

export async function randomStringAsync(options: {
  length: number;
  type: 'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric';
}): Promise<string> {
  const { cryptoRandomStringAsync } = await import('crypto-random-string');
  return cryptoRandomStringAsync(options);
}

export function randomStringSync(options: {
  length: number;
  type: 'url-safe' | 'numeric' | 'memory-numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric';
}): string {
  let result = '';
  const currentCharacters = characters[options.type]!;
  const charactersLength = currentCharacters.length;
  for (let i = 0; i < options.length; i++) {
    result += currentCharacters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
