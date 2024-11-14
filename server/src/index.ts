import express, { Request, Response } from "express";
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { PORT } = process.env;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
