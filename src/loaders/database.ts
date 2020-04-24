import { Sequelize } from 'sequelize-typescript';

import { File } from '../models';

class Database {
  database: Sequelize;

  constructor(url: string) {
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
  static readonly DATABASE_URL: string = process.env.DATABASE_URL || '';
  static readonly instance: Database = new Database(DatabaseFactory.DATABASE_URL);
}
