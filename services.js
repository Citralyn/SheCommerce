const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 


app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


const { MongoClient } = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGO_KEY;

const client = new MongoClient(uri);

async function add_custom_products(name, product, desc, price) {
  try {
    await client.connect();
    const db = client.db('SheCommerceDB');
    const collection = db.collection('products');

    // insert into DB
    await collection.insertOne({"Name": name, Product_Types: product, "description": desc, "price": price});

  } catch(err) {
    console.log(err); 
  }
    finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}

async function search_product(product) {
  try {
    await client.connect();
    const db = client.db('SheCommerceDB');
    const collection = db.collection('products');

    const single = await collection.findOne({Product_Types : {$regex : product}});
    console.log(single);
    //const cursor = collection.find({Product_Types : {$regex : product}});

    // Print a message if no documents were found
    if ((await collection.countDocuments({Product_Types : {$regex : product}})) === 0) {
      console.log("No documents found!");
    } else {
      return single; 
    }
    // Print returned documents
    /*
    for await (const doc of cursor) {
      console.dir(doc);
    }*/

    

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
    res.sendFile(path.join(__dirname, 'first.html'));
});

app.get('/second.html', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'second.html'));
});

app.get('/third.html', (req, res) => {
  // Send the HTML file as the response
  res.sendFile(path.join(__dirname, 'third.html'));
});

app.post('/share_product', function(req, res) {
    const data = req.body;
    // Send a response back to the client

    //res.status(200).json({ data: data, message: 'Data received successfully' });
    add_custom_products(req.body.name, req.body.product, req.body.description, req.body.price);
})

app.post('/find_product', function(req, res) {
  const data = req.body.product;
  const cat = search_product(req.body.product).then((result)=> {
    //the promise is resolved here
    console.log("HI")
    res.render("new.html", {
      test: result.Name
    });
    console.log(result)
  }).catch(console.error.bind(console));

  console.log("MEOW")
  console.log(cat);



  // Send a response back to the client

  //res.status(200).json({ data: data, message: 'Data received successfully' });
  /*
  var cat = search_product(req.body.product);
  console.log(cat);
  res.render("new.html", {
    test: cat.Name
  });
  */
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})