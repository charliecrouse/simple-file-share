import { Sequelize } from 'sequelize-typescript';

import { File } from '../models';

class Database {
  url: string;
  database: Sequelize;

  constructor(url: string) {
    this.url = url;
    this.database = new Sequelize(url, {
      dialect: 'postgres',
      logging: false,
    });
    this.database.addModels([File]);
  }

  connect = async (): Promise<void> => {
    await this.database.sync();
  };
}

export class DatabaseFactory {
  static readonly url: string = process.env.DATABASE_URL || '';
  static readonly instance: Database = new Database(DatabaseFactory.url);
}
