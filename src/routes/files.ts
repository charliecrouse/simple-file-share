import { NextFunction, Request, Response, Router } from 'express';

import { fileService } from '../controllers';
import { downloadFile, uploadFile } from '../utils/filestore';

export async function createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await fileService.createFile();
    const secret = await uploadFile(file.id, req);

    const payload = {
      statusCode: 201,
      message: 'The given file is being stored.',
      secret,
      file: file.toJSON(),
    };

    res.status(payload.statusCode).json(payload);
  } catch (err) {
    return next(err);
  }
}

export async function readFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;
  const secret: string = req.query.secret || '';

  try {
    const file = await fileService.findFileById(id);
    await downloadFile(file.id, secret, res);
  } catch (err) {
    return next(err);
  }
}

export const files = Router();

files.post('/', createFile);
files.get('/:id', readFile);
