import fs from "fs/promises";
import { Book } from "./Book.js";

const PATH = ("./src/bookDB.json");

let books: Book[] = [];

export const loadBooks = async () => {
  try {
    const data = await fs.readFile(PATH, "utf-8");
    books = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading books file: ", error);
    books = [];
  }
};

export const saveBooks = async () => {
  try {
    await fs.writeFile(PATH, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error("Error writing books file: ", error);
  }
};

export const getBooks = () => books;

export const addBook = (book: Book) => {
  books.push(book);
  return book;
};

export const findBookById = (id: string) => books.find((b) => b.id === id);

export const updateBook = (book: Book) => {
  const index = books.findIndex((b) => b.id === book.id);
  if (index !== -1) {
    books[index] = book;
  }
  return book;
};

export const deleteBook = (id: string) => {
  books = books.filter((b) => b.id !== id);
};