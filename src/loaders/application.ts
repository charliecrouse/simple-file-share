import bodyparser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { router } from '../routes';

class Application {
  app: express.Application;

  constructor(port: number) {
    this.app = express();
    this.app.set('port', port);

    this.app.use(cors());
    this.app.use(router);
    this.app.use(bodyparser.text());
    this.app.use(bodyparser.json());
    this.app.use(bodyparser.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(morgan('dev'));

    this.app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      return res
        .status(400)
        .json({ message: err.message || err })
        .send();
    });

    this.app.get('/healthcheck', (_req, res) => {
      res.status(200).send();
    });
  }

  start = async (): Promise<void> => {
    await this.app.listen(this.app.get('port'));
  };
}

export class ApplicationFactory {
  static readonly APPLICATION_PORT: number = parseInt(process.env.PORT || '5000');
  static readonly instance: Application = new Application(ApplicationFactory.APPLICATION_PORT);
}
