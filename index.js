require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const run = async () => {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const db = client.db("book-catalog");
    const bookCollection = db.collection("books");

    //get all books
    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find({});
      console.log(cursor);
      const books = await cursor.toArray();
      res.send({ status: 200, data: books });
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Book Catalog app running on port :  ${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
run().catch((err) => console.log(err));
