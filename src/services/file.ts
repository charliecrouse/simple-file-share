import { v4 as uuid } from 'uuid';
import { File } from '../models';

export async function createFile(): Promise<File> {
  const file = new File({ id: uuid() });
  return await file.save();
}

export async function findFileById(id: string): Promise<File> {
  const file = await File.findByPk(id);

  if (!file) {
    return Promise.reject(new Error(`Failed to find File with id ${id}.`));
  }

  return file;
}
