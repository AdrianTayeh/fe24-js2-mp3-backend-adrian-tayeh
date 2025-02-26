import express from "express";
import cors from "cors";
import bookRoutes from "./modules/bookRoutes.js";
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(bookRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
