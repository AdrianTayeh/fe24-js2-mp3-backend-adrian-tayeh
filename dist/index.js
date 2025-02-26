"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const PORT = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
let books = [];
const loadBooks = async () => {
    try {
        const data = await promises_1.default.readFile("./src/bookDB.json", "utf-8");
        books = data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error("Error reading books file: ", error);
        books = [];
    }
};
const saveBooks = async () => {
    try {
        await promises_1.default.writeFile("./src/bookDB.json", JSON.stringify(books, null, 2));
    }
    catch (error) {
        console.error("Error writing books file: ", error);
    }
};
loadBooks();
app.get("/books", (req, res) => {
    res.json(books);
});
app.post("/books", async (req, res) => {
    const { title, writer } = req.body;
    if (typeof title !== 'string' || typeof writer !== 'string') {
        res.status(400).json({ errors: [{ msg: 'Invalid input' }] });
        return;
    }
    const newBook = {
        id: (0, uuid_1.v4)(),
        title,
        writer,
        read: false
    };
    books.push(newBook);
    await saveBooks();
    res.status(201).json(newBook);
});
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
    }
    else {
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
        }
        else {
            res.status(400).send("Book must be marked as read before adding a review");
        }
    }
    else {
        res.status(404).send("Book not found");
    }
});
app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    books = books.filter((b) => b.id !== id);
    await saveBooks();
    res.status(204).send();
});
