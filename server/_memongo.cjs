const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  console.log('Starting in-memory MongoDB (this may download a binary on first run)...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      ip: '127.0.0.1',
      dbName: 'consultpro',
    },
  });
  const uri = mongod.getUri('consultpro');
  console.log('SUCCESS: In-memory MongoDB started!');
  console.log('URI:', uri);
  console.log('DB : consultpro');
  console.log('This process will keep running. Press Ctrl+C to stop.');
  // Keep process alive
  process.stdin.resume();
}

main().catch((err) => {
  console.error('Failed to start in-memory MongoDB:', err.message);
  process.exit(1);
});
