import bodyparser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { router } from '../routes';

class Application {
  app!: express.Application;
  port!: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.app.use(router);
    this.app.use(bodyparser.json());
    this.app.use(bodyparser.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(morgan('dev'));

    this.app.get('/healthcheck', (_req, res) => {
      res.status(200).send();
    });
  }

  start = async (): Promise<void> => {
    await this.app.listen(this.port);
  };
}

export class ApplicationFactory {
  static readonly port: number = parseInt(process.env.PORT || '5000');
  static readonly instance: Application = new Application(ApplicationFactory.port);
}
