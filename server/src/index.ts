import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "./middleware/local-strategy";
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { PORT, SECRET_SESSION } = process.env;
const localhostPort = Number(PORT);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: SECRET_SESSION || "Melvunx",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth.routes");
const itemsRoutes = require("./routes/items.routes");
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log(req.session);
  console.log(req.sessionID);
  req.session.visited = true;
  // res.cookie("Hello-cookies", "values", { maxAge: 60000, signed: true });
  res.send("Hello World");
});

app.listen(localhostPort, () =>
  console.log(
    `Server running on port http://localhost:${localhostPort}`
  )
);
