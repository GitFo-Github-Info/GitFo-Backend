const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://api.github.com/users/${id}`)
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

router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://api.github.com/search/users?q=${id}`)
    .then((response) => {
      const users = response.data;
    //   console.log(users);
      res.send(users);
    })
    .catch((error) => {
      console.log("API 호출 실패:", error.response.status);
      console.log(error.response.data);
    });
});

module.exports = router;
