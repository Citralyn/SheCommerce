const { MongoClient } = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGO_KEY;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('SheCommerceDB');
    const collection = db.collection('products');

    // Find the first document in the collection
    const first = await collection.findOne({Product_Types : {$regex : "cookie"}});

    console.log(first);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
run().catch(console.error);