const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 


const { MongoClient } = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGO_KEY;

const client = new MongoClient(uri);

async function add_to_database(us, pw, product) {
  try {
    await client.connect();
    const db = client.db('SheCommerceDB');
    const collection = db.collection('products');

    // insert into DB
    await collection.insertOne({"username": us, "password": pw, "product_name": product});

  } catch(err) {
    console.log(err); 
  }
    finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}


app.get('/', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, 'products.html'));
});


app.post('/submit', function(req, res) {
    const data = req.body;
    // Send a response back to the client

    res.status(200).json({ data: data, message: 'Data received successfully' });
    add_to_database(req.body.username, req.body.password, req.body.product);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})