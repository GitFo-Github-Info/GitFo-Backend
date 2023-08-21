const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const token = req.session.token;
  axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const user_data = response.data;
    //   console.log(user_data);
      res.send(user_data);
    })
    .catch((error) => {
      console.log("API 호출 실패:", error.response.status);
      console.log(error.response.data);
    });
});

module.exports = router;
