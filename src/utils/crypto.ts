import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

export interface DecipherData {
  iv: string;
  password: string;
}

export interface CipherData extends DecipherData {
  cipher: crypto.Cipher;
}

const ALGORITHM = 'aes-256-cbc';

function generateDecipherData(): DecipherData {
  const base: string = uuid().split('-').join('');
  const password = base.slice(0, 16);
  const iv = base.slice(16, 32);
  return { password, iv };
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
  const { password, iv } = generateDecipherData();
  const key = await getKey(password);
  const cipher = crypto.createCipheriv(ALGORITHM, key, Buffer.from(iv));
  return { password, iv, cipher };
}

export async function createDecipher(data: DecipherData): Promise<crypto.Decipher> {
  const { password, iv } = data;
  const key = await getKey(password);
  return crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv));
}
