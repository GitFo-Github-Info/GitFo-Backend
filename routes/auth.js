require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const env = process.env;

router.get("/", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${ env.CLIENT_ID }`
  );
});

router.get("/github/callback", (req, res) => {
  axios
    .post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        code: req.query.code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then((result) => {
      console.log(result.data.access_token);
      req.session.token = result.data.access_token;
      res.send(result.data.access_token);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
