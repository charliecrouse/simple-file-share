import { Stream } from 'stream';
import { FilestoreFactory } from '../loaders';

export const ROOT_BUCKET = 'simple-file-share';
export const FILE_BUCKET = ROOT_BUCKET + '/files';

export function readFile(fileId: string): Promise<Stream> {
  return new Promise((resolve, reject) => {
    FilestoreFactory.instance.filestore.getObject(FILE_BUCKET, fileId, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

export async function createFile(fileId: string, stream: Stream): Promise<void> {
  return new Promise((resolve, reject) => {
    FilestoreFactory.instance.filestore.putObject(FILE_BUCKET, fileId, stream, (err, result) => {
      if (err) return reject(err);
      console.log(`Finished Uploading to Minio: ${result}.`);
      return resolve();
    });
  });
}
