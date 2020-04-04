import { ApplicationFactory } from './loaders';

async function main(): Promise<void> {
  const application = ApplicationFactory.instance;

  await application.start();
  console.log(`Application is listening on http://localhost:${application.port}`);
}

if (!module.parent) {
  main();
}
