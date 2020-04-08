import * as Minio from 'minio';

class Filestore {
  static readonly BUCKET: string = 'simple-file-share';
  static readonly FILES_BUCKET: string = Filestore.BUCKET + '/files';
  static readonly REGION: string = 'us-east-1';

  filestore: Minio.Client;

  constructor(endPoint: string, port: number, accessKey: string, secretKey: string) {
    this.filestore = new Minio.Client({
      endPoint,
      port,
      accessKey,
      secretKey,
      useSSL: false,
    });
  }

  initialize = async (): Promise<void> => {
    this.filestore.bucketExists(Filestore.BUCKET, (err, exists) => {
      if (err) return Promise.reject(err);
      if (exists) return Promise.resolve();

      this.filestore.makeBucket(Filestore.BUCKET, Filestore.REGION, (err) => {
        if (err) return Promise.reject(err);
        return Promise.resolve();
      });
    });
  };
}

export class FilestoreFactory {
  static readonly endPoint: string = process.env.FILESTORE_URL || 'localhost';
  static readonly port: number = parseInt(process.env.FILESTORE_PORT || '9000');
  static readonly accessKey: string = process.env.FILESTORE_USERNAME || 'minio';
  static readonly secretKey: string = process.env.FILESTORE_PASSWORD || 'supersecret';
  static readonly instance: Filestore = new Filestore(
    FilestoreFactory.endPoint,
    FilestoreFactory.port,
    FilestoreFactory.accessKey,
    FilestoreFactory.secretKey,
  );
}
