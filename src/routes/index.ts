import { Router } from 'express';

import { files } from './files';

export const router = Router();

router.use('/files', files);

router.get('/healthcheck', (_req, res) => {
  return res.status(200).send();
});
