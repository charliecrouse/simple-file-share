import { S3 } from 'aws-sdk';
import { Readable, Writable } from 'stream';

import { FilestoreFactory } from '../loaders';
import { DecipherData, createCipher, createDecipher } from './crypto';

export const ROOT_BUCKET = 'simple-file-share';

export const getUploadStream = (fileId: string, rs: Readable): S3.ManagedUpload => {
  const options = {
    Bucket: ROOT_BUCKET,
    Key: 'files/' + fileId,
    Body: rs,
  };

  return FilestoreFactory.instance.filestore.upload(options);
};

export const getDownloadStream = (fileId: string): Readable => {
  const options = {
    Bucket: ROOT_BUCKET,
    Key: 'files/' + fileId,
  };

  return FilestoreFactory.instance.filestore.getObject(options).createReadStream();
};

export const uploadFile = async (fileId: string, rs: Readable): Promise<DecipherData> => {
  const { cipher, password, iv } = await createCipher();

  const uploadStream = getUploadStream(fileId, rs.pipe(cipher));

  uploadStream.on('httpUploadProgress', (progress) => {
    // TODO: notify client of progress
    console.log(`[${fileId} uploaded ${progress.loaded}/${progress.total}`);
  });
  uploadStream.send();

  return { password, iv };
};

export const downloadFile = async (
  fileId: string,
  data: DecipherData,
  ws: Writable,
): Promise<void> => {
  const decipher = await createDecipher(data);
  const downloadStream = getDownloadStream(fileId);
  downloadStream.pipe(decipher).pipe(ws);

  return new Promise((resolve, reject) => {
    decipher.on('error', reject);
    decipher.on('end', resolve);
  });
};
