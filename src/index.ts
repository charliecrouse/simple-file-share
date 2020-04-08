import { ApplicationFactory, DatabaseFactory, FilestoreFactory } from './loaders';

async function main(): Promise<void> {
  const database = DatabaseFactory.instance;
  await database.connect();
  console.log('Connected to database');

  const filestore = FilestoreFactory.instance;
  await filestore.initialize();
  console.log('Filestore initialized');

  const application = ApplicationFactory.instance;
  await application.start();
  console.log(`Application is listening on http://localhost:${application.port}`);
}

if (!module.parent) {
  main().catch((err) => {
    console.error(err.message || err);
    return process.exit(1);
  });
}
