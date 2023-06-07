const express = require('express');
const app = express();
const cors = require('cors');
require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 2000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware:
app.use(cors());
app.use(express.json());

// database connection:
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wndd9z6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version:
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// database functionalities:
async function run() {
  try {
    // connect the client to the server:
    await client.connect();

    // check server connection:
    await client.db('admin').command({ ping: 1 });
    console.log("Chief! You've successfully connected to MongoDB!");
  } finally {
    // optional
  }

  run().catch(console.dir);
}

app.get('/', (req, res) => {
  res.send('old-school');
});

app.listen(port, () => {
  console.log(`Old-school listening on port: ${port}`);
});
