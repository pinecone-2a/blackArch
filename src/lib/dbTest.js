// This is a standalone script to test MongoDB connection
// Run with: node src/lib/dbTest.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not defined in environment variables');
    return false;
  }
  
  console.log(`Database URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, "//***:***@")}`);
  
  const client = new MongoClient(process.env.DATABASE_URL, {
    connectTimeoutMS: 5000, // 5 seconds timeout
    socketTimeoutMS: 5000
  });
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // List all databases
    const dbList = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Get the DB name from connection string
    const dbName = process.env.DATABASE_URL.split('/').pop().split('?')[0];
    console.log(`Using database: ${dbName}`);
    
    // List collections in the database
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️ No collections found in database');
    } else {
      console.log('Collections in database:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Check counts for key collections
      const collectionCounts = {};
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        collectionCounts[collection.name] = count;
      }
      
      console.log('Collection document counts:');
      Object.entries(collectionCounts).forEach(([name, count]) => {
        console.log(`- ${name}: ${count} documents`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log('Test completed, success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error during test:', err);
    process.exit(1);
  }); 