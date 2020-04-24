import { S3 } from 'aws-sdk';
import { Readable, Writable } from 'stream';

import { FilestoreFactory, SocketFactory } from '../loaders';
import { DecipherData, createCipher, createDecipher } from './crypto';
import { fileService } from '../controllers';

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

  uploadStream.on('httpUploadProgress', async (progress) => {
    if (progress.loaded == progress.total) {
      console.log(`[${fileId}] finished uploading`);
      SocketFactory.instance.emitter.emit(`file-upload-complete-${fileId}`);
      return await fileService.setFileSize(fileId, progress.total);
    }

    const fraction = progress.total ? progress.loaded / progress.total : 0.1;
    const percent = (fraction * 100).toFixed(0);
    console.log(`[${fileId}] uploaded ${percent}%`);
    SocketFactory.instance.emitter.emit(`file-upload-progress-${fileId}`, fraction);
  });
  uploadStream.send();

  return { password, iv };
};

export const downloadFile = async (fileId: string, data: DecipherData, ws: Writable): Promise<void> => {
  const decipher = await createDecipher(data);
  const downloadStream = getDownloadStream(fileId);
  downloadStream.pipe(decipher).pipe(ws);

  return new Promise((resolve, reject) => {
    decipher.on('error', (err) => {
      SocketFactory.instance.emitter.emit(`file-download-error-${fileId}`);
      return reject(err);
    });
    decipher.on('end', resolve);
  });
};
