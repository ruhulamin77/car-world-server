const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qu1uq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carWorld");
    const carsCollection = database.collection("cars");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");

    // GET API
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // GET Single car
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.json(car);
    });

    // POST API
    app.post("/cars", async (req, res) => {
      const car = req.body;
      // console.log('hitting api', car);
      const result = await carsCollection.insertOne(car);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log('hitting api', user);
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Carworld!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
