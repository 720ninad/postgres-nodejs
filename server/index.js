import express, { json } from "express";
import { connection } from "./postgres/postgres.js";
import router from "./routes/route.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use(router);

app.use("/", express.static(join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
connection();
