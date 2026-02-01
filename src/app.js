import express from "express";
import dotenv from "dotenv";
import routes from "./routes/mainRoutes.js";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use("/api", routes);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
