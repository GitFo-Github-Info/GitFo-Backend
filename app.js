require("dotenv").config();
const express = require("express");
const session = require("express-session");

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");

const env = process.env;
const app = express();
app.set("port", process.env.PORT || 3000);

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
