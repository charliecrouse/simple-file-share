import { Stream, Writable } from 'stream';
import { FilestoreFactory } from '../loaders';

export const ROOT_BUCKET = 'simple-file-share';

export function downloadFile(fileId: string, res: Writable): Promise<void> {
  return new Promise((resolve, reject) => {
    FilestoreFactory.instance.filestore.getObject(
      ROOT_BUCKET,
      'files/' + fileId,
      (err, result) => {
        if (err) return reject(err);
        result.pipe(res);
        result.on('error', reject);
        result.on('end', resolve);
      },
    );
  });
}

export async function uploadFile(fileId: string, req: Stream): Promise<void> {
  return new Promise((resolve, reject) => {
    FilestoreFactory.instance.filestore.putObject(
      ROOT_BUCKET,
      'files/' + fileId,
      req,
      (err, result) => {
        if (err) return reject(err);
        console.log(`Finished Uploading to Minio: ${result}.`);
        return resolve();
      },
    );
  });
}
