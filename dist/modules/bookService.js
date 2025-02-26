import fs from "fs/promises";
const PATH = ("./src/bookDB.json");
let books = [];
export const loadBooks = async () => {
    try {
        const data = await fs.readFile(PATH, "utf-8");
        books = data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error("Error reading books file: ", error);
        books = [];
    }
};
export const saveBooks = async () => {
    try {
        await fs.writeFile(PATH, JSON.stringify(books, null, 2));
    }
    catch (error) {
        console.error("Error writing books file: ", error);
    }
};
export const getBooks = () => books;
export const addBook = (book) => {
    books.push(book);
    return book;
};
export const findBookById = (id) => books.find((b) => b.id === id);
export const updateBook = (book) => {
    const index = books.findIndex((b) => b.id === book.id);
    if (index !== -1) {
        books[index] = book;
    }
    return book;
};
export const deleteBook = (id) => {
    books = books.filter((b) => b.id !== id);
};
