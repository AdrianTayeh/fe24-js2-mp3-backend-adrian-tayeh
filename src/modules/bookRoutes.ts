import { Router } from "express";
import { getBooksHandler, addBookHandler, updateReadStatusHandler, updateReviewHandler, deleteBookHandler } from "./bookController.js";

const router = Router();

router.get("/books", getBooksHandler);
router.post("/books", addBookHandler);
router.patch("/books/:id/read", updateReadStatusHandler);
router.patch("/books/:id/review", updateReviewHandler);
router.delete("/books/:id", deleteBookHandler);

export default router;