require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const session = require("express-session");

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");

const app = express();
app.use(cors());
const env = process.env;
app.set("port", process.env.PORT || 3000);

if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/search", searchRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "node start!");
});
