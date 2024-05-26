import React from "react";
// import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const { MongoClient } = require('mongodb');

require('dotenv').config();
const uri = process.env.MONGO_KEY;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('SheCommerceDB');
    const collection = db.collection('Accounts');

    // Find the first document in the collection
    const first = await collection.findOne();
    console.log(first);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
run().catch(console.error);