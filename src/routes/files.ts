import { NextFunction, Request, Response, Router } from 'express';

import { fileService } from '../services';
import { downloadFile, uploadFile } from '../utils/filestore';

export async function createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await fileService.createFile();
    const { password, iv } = await uploadFile(file.id, req);

    const payload = {
      statusCode: 201,
      message: 'The given file is being stored.',
      file: {
        password,
        iv,
        ...file.toJSON(),
      },
    };

    res.status(payload.statusCode).json(payload);
  } catch (err) {
    return next(err);
  }
}

export async function readFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;
  const password: string = req.query.password || '';
  const iv: string = req.query.iv || '';

  try {
    const file = await fileService.findFileById(id);
    const data = { password, iv };
    await downloadFile(file.id, data, res);
  } catch (err) {
    return next(err);
  }
}

export const files = Router();

files.post('/', createFile);
files.get('/:id', readFile);
