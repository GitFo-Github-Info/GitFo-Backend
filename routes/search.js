const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const env = process.env;

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

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const page = req.query.page;
  let users_Info = [];
  axios
    .get(
      `https://api.github.com/search/users?q=${id}&per_page=10&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + env.GITHUB_TOKEN,
        },
      }
    )
    .then(async (response) => {
      const users = response.data;
      const requests = users.items.map((item) => {
        if (item === undefined) {
          return null;
        }
        return axios.get(item.url, {
          headers: {
            Authorization: "Bearer " + env.GITHUB_TOKEN,
          },
        });
      });

      const allResponses = await Promise.all(requests);
      allResponses.forEach((user_Info, index) => {
        if (user_Info) {
          const user = user_Info.data;
          users_Info.push({
            profile_img: user.avatar_url,
            id: user.login,
            name: user.name,
            bio: user.bio,
            company: user.company,
            public_repos: user.public_repos,
            followers: user.followers,
            following: user.following,
            location: user.location,
          });
        }
      });
      users_Info.push(users.total_count);
      res.send(users_Info);
    })
    .catch((error) => {
      console.log("API 호출 실패:", error.response.status);
      console.log(error.response.data);
    });
});

module.exports = router;
