const express = require("express");

const pageRouter = require("./routes/page")
const authRouter = require("./routes/auth")

const app = express();
app.set("port", process.env.PORT || 3000);

app.use("/", pageRouter);
app.use("/auth", authRouter);

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "node start!");
  });