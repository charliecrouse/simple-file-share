import { NextFunction, Request, Response, Router } from 'express';
import { downloadFile, uploadFile } from '../utils/filestore';

import { fileService } from '../services';

export async function createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await fileService.createFile();

    const payload = {
      statusCode: 201,
      message: 'The given file is being stored.',
      file,
    };

    uploadFile(file.id, req);
    res.status(payload.statusCode).json(payload);
  } catch (err) {
    return next(err);
  }
}

export async function readFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;

  try {
    const file = await fileService.findFileById(id);
    await downloadFile(file.id, res);
  } catch (err) {
    return next(err);
  }
}

export const files = Router();

files.post('/', createFile);
files.get('/:id', readFile);
