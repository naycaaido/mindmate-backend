import express from "express";
import dotenv from "dotenv";
import routes from "./routes/mainRoutes.js";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import oauthRouter from "./routes/oauthRoute.js";

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use("/api", routes);
app.use(errorMiddleware);
app.use("/", oauthRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
