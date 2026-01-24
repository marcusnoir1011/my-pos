import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { errorHandler } from "./libs/errorhandler.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

// error
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running at port:${PORT}`));

export default app;
