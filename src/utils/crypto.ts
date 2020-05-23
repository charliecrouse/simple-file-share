import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

export interface DecipherData {
  password: string;
  iv: string;
}

export interface CipherData extends DecipherData {
  cipher: crypto.Cipher;
}

const ALGORITHM = 'aes-256-cbc';

export function validateSecret(secret: string): boolean {
  if (!secret) return false;
  if (secret.indexOf('-') === -1) return false;
  const split = secret.split('-');
  if (split.length < 2) return false;
  if (split[0].length < 16) return false;
  if (split[1].length < 16) return false;
  return true;
}

export function makeDecipherData(input?: string): DecipherData {
  if (input && !validateSecret(input)) {
    throw new Error(`Invalid secret "${input}"!`);
  }

  const secret: string = (input && input.split('-').join('')) || uuid().split('-').join('');
  const password = secret.slice(0, 16);
  const iv = secret.slice(16, 32);
  return { password, iv };
}

export function makeSecret(data: DecipherData): string {
  return `${data.password}-${data.iv}`;
}

async function getKey(password: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const salt = process.env.CRYPTO_SALT || 'salt';

    crypto.scrypt(password, salt, 32, (err, key) => {
      if (err) return reject(err);
      return resolve(key);
    });
  });
}

export async function createCipher(): Promise<CipherData> {
  const { password, iv } = makeDecipherData();
  const key = await getKey(password);
  const cipher = crypto.createCipheriv(ALGORITHM, key, Buffer.from(iv));
  return { password, iv, cipher };
}

export async function createDecipher(data: DecipherData): Promise<crypto.Decipher> {
  const { password, iv } = data;
  const key = await getKey(password);
  return crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv));
}
