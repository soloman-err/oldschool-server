const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 2000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

// middleware:
app.use(cors());
app.use(express.json());

// jwt processor:
// const verifyJWT = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return res
//       .status(401)
//       .send({ error: true, message: 'Invalid authorization' });
//   }

//   // bearer authorization token:
//   const token = authorization.split(' ')[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//     if (error) {
//       return res
//         .status(401)
//         .send({ error: true, message: 'Invalid authorization' });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

// database connection:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wndd9z6.mongodb.net/?retryWrites=true&w=majority`;

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

    // database collections:
    const usersCollection = client.db('oldschool').collection('users');

    // JWT configuration:
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
      });
      res.send(token);
    });

    // user based APIs:
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
      console.log(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user?.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists!' });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    // check server connection:
    await client.db('admin').command({ ping: 1 });
    console.log("Chief! You've successfully connected to MongoDB!");
  } finally {
    // optional
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('old-school');
});

app.listen(port, () => {
  console.log(`Old-school listening on port: ${port}`);
});
