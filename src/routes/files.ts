import { Router, Request, Response, NextFunction } from 'express';

import { fileService } from '../services';

export async function createFile(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = await fileService.createFile();
    const payload = {
      statusCode: 201,
      message: 'Successfully created new file',
      file,
    };
    res.status(payload.statusCode).json(payload);
  } catch (err) {
    return next(err);
  }
}

export async function readFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;

  try {
    const file = await fileService.findFileById(id);
    const payload = {
      statusCode: 200,
      message: 'Successfully retrieved file',
      file,
    };
    res.status(payload.statusCode).json(payload);
  } catch (err) {
    return next(err);
  }
}

export const files = Router();

files.post('/', createFile);
files.get('/:id', readFile);
