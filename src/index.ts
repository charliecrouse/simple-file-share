import { ApplicationFactory, DatabaseFactory } from './loaders';

async function main(): Promise<void> {
  const database = DatabaseFactory.instance;
  await database.connect();
  console.log('Connected to database');

  const application = ApplicationFactory.instance;
  await application.start();
  console.log(`Application is listening on http://localhost:${application.port}`);
}

if (!module.parent) {
  main();
}
