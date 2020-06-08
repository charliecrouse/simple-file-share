import * as yup from 'yup';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

export interface DecipherData {
  password: string;
  iv: string;
}

export interface CipherData extends DecipherData {
  cipher: crypto.Cipher;
}

const ALGORITHM = 'aes-256-cbc';
const SECRET_SCHEMA = yup.string().required().length(32);

export const createDecipherData = (): DecipherData => ({
  password: nanoid(16),
  iv: nanoid(16),
});

export const secretToDecipherData = (secret: string): DecipherData => {
  if (!SECRET_SCHEMA.isValidSync(secret)) {
    throw new Error(`Invalid secret \"${secret}\"!`);
  }

  const password = secret.slice(0, 16);
  const iv = secret.slice(16, 32);

  console;

  return { password, iv };
};

export const decipherDataToSecret = (decipherData: DecipherData): string =>
  `${decipherData.password}${decipherData.iv}`;

export const getKey = async (password: string): Promise<Buffer> => {
  return new Promise((res, rej) => {
    const salt = process.env.CRYPTO_SALT || 'salt';

    crypto.scrypt(password, salt, 32, (err, key) => {
      if (err) return rej(err);
      return res(key);
    });
  });
};

export class Encrypter {
  stream!: crypto.Cipher;
  secret!: string;
  ready: Promise<void>;

  constructor() {
    this.ready = new Promise(async (resolve, reject) => {
      try {
        const decipherData = createDecipherData();
        this.secret = decipherDataToSecret(decipherData);
        const key = await getKey(decipherData.password);
        this.stream = crypto.createCipheriv(ALGORITHM, key, Buffer.from(decipherData.iv));
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
}

export class Decrypter {
  stream!: crypto.Decipher;
  ready: Promise<void>;

  constructor(secret: string) {
    this.ready = new Promise(async (resolve, reject) => {
      try {
        const { password, iv } = secretToDecipherData(secret);
        const key = await getKey(password);
        this.stream = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv));
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
}
