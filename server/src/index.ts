import express, { Request, Response } from "express";
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;
const localhostPort = Number(PORT);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const itemsRoutes = require("./routes/items.routes");
app.use("/api", authRoutes);
app.use("/api", itemsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(localhostPort, () =>
  console.log(`Server running on port http://localhost:${localhostPort}`)
);
