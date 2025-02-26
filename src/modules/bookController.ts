import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Book } from "./Book.js";
import { loadBooks, saveBooks, getBooks, addBook, findBookById, updateBook, deleteBook } from "./bookService.js";

loadBooks();

export const getBooksHandler = (req: Request, res: Response) => {
  res.json(getBooks());
};

export const addBookHandler = async (req: Request, res: Response) => {
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
  addBook(newBook);
  await saveBooks();
  res.status(201).json(newBook);
};

export const updateReadStatusHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = findBookById(id);
  if (book) {
    book.read = req.body.read;
    if (!book.read) {
      delete book.review;
    }
    updateBook(book);
    await saveBooks();
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
};

export const updateReviewHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = findBookById(id);
  if (book) {
    if (book.read) {
      book.review = req.body.review;
      updateBook(book);
      await saveBooks();
      res.json(book);
    } else {
      res.status(400).send("Book must be marked as read before adding a review");
    }
  } else {
    res.status(404).send("Book not found");
  }
};

export const deleteBookHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  deleteBook(id);
  await saveBooks();
  res.status(204).send();
};