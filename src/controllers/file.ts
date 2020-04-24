import { v4 as uuid } from 'uuid';
import { File } from '../models';

export const createFile = async (): Promise<File> => {
  const file = new File({ id: uuid() });
  return await file.save();
};

export const findFileById = async (id: string): Promise<File> => {
  const file = await File.findByPk(id);

  if (!file) {
    return Promise.reject(new Error(`Failed to find File with id ${id}.`));
  }

  return file;
};

export const setFileSize = async (id: string, size: number): Promise<void> => {
  const file = await findFileById(id);
  file.size = size;
  await file.save();
};
