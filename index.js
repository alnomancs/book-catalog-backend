const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const run = async () => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect(); // Establish MongoDB connection

    const db = client.db("book-catalog");
    const bookCollection = db.collection("books");

    app.get("/books", async (req, res) => {
      try {
        const cursor = bookCollection.find({});
        const books = await cursor.toArray();

        const responseData = { status: 200, data: books };
        res.send(responseData);
      } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
      }
    });

    app.post("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const review = req.body;
      // console.log(review);

      const result = await bookCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { reviews: review } }
      );
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Review has been updated" });
      } else {
        const message = "There are no books for the given review.";
        res.status(404).json({ error: message });
      }
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Book Catalog app running on port: ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Close the client when server is stopped
    // await client.close();
  }
};

run().catch((err) => console.error("Error in run:", err));
