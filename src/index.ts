import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const PORT = 3000;
const app = express();
const PATH = "./bookDB.json";

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

type Book = {
  id: string;
  title: string;
  writer: string;
  read: boolean;
  review?: "liked" | "disliked";
};

let books: Book[] = [];

const loadBooks = async () => {
  try {
    const data = await fs.readFile(PATH, "utf-8");
    books = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading books file: ", error);
    books = [];
  }
};

const saveBooks = async () => {
  try {
    await fs.writeFile(PATH, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error("Error writing books file: ", error);
  }
};

loadBooks();

app.get("/books", (req, res) => {
  res.json(books);
});

app.post(
  "/books",
  async (req, res) => {
    const { title, writer } = req.body;

    if (typeof title !== 'string' || typeof writer !== 'string') {
      res.status(400).json({ errors: [{ msg: 'Invalid input' }] });
      return;
    }

    const newBook: Book = {
      id: uuidv4(),
      title,
      writer,
      read: false
    };
    books.push(newBook);
    await saveBooks();
    res.status(201).json(newBook);
  }
);

app.patch("/books/:id/read", async (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (book) {
    book.read = req.body.read;
    if (!book.read) {
      delete book.review;
    }
    await saveBooks();
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});

app.patch("/books/:id/review", async (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (book) {
    if (book.read) {
      book.review = req.body.review;
      await saveBooks();
      res.json(book);
    } else {
      res.status(400).send("Book must be marked as read before adding a review");
    }
  } else {
    res.status(404).send("Book not found");
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  books = books.filter((b) => b.id !== id);
  await saveBooks();
  res.status(204).send();
});