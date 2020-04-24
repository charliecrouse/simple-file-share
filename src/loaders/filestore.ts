import { S3 } from 'aws-sdk';

import { ROOT_BUCKET } from '../utils/filestore';

class Filestore {
  filestore: S3;

  constructor(endpoint: string, accessKeyId: string, secretAccessKey: string) {
    this.filestore = new S3({
      endpoint,
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
    });
  }

  initialize = async (): Promise<void> => {
    await this.createBucket(ROOT_BUCKET);
  };

  checkBucketExists = (bucket: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const options = { Bucket: bucket };
      this.filestore.headBucket(options, (err) => {
        if (!err) return resolve(true);
        if (err.statusCode == 404) return resolve(false);
        reject(err);
      });
    });
  };

  createBucket = (bucket: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const exists = await this.checkBucketExists(bucket);
      if (exists) return resolve();

      this.filestore.createBucket({ Bucket: bucket }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
}

export class FilestoreFactory {
  static readonly FILESTORE_ENDPOINT = process.env.FILESTORE_ENDPOINT || '';
  static readonly FILESTORE_ACCESS_KEY = process.env.FILESTORE_ACCESS_KEY || '';
  static readonly FILESTORE_SECRET_ACCESS_KEY = process.env.FILESTORE_SECRET_ACCESS_KEY || '';

  static readonly instance: Filestore = new Filestore(
    FilestoreFactory.FILESTORE_ENDPOINT,
    FilestoreFactory.FILESTORE_ACCESS_KEY,
    FilestoreFactory.FILESTORE_SECRET_ACCESS_KEY,
  );
}
