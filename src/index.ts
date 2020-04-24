require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { ApplicationFactory, DatabaseFactory, FilestoreFactory, SocketFactory } from './loaders';

async function main(): Promise<void> {
  const database = DatabaseFactory.instance;
  await database.connect();
  console.log('Successfully connected to database');

  const filestore = FilestoreFactory.instance;
  await filestore.initialize();
  console.log('Succesfully connected to filestore');

  const application = ApplicationFactory.instance;
  await application.start();
  console.log(`Application is listening at http://localhost:${ApplicationFactory.APPLICATION_PORT}`);

  const socket = SocketFactory.instance;
  await socket.initialize();
  console.log(`Socket server is listening at http://localhost:${ApplicationFactory.APPLICATION_PORT}/socket`);
}

if (!module.parent) {
  main().catch((err) => {
    console.error(err.message || err);
    return process.exit(1);
  });
}
