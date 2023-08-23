const express = require("express");
const cheerio = require("cheerio");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const env = process.env;

const header = `headers: {
    Authorization: "Bearer " + ${env.GITHUB_TOKEN},
  }`;

router.get("/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://api.github.com/users/${id}`, {
      header,
    })
    .then((response) => {
      const user_data = response.data;
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
      `https://api.github.com/search/users?q=${id} type:user&per_page=10&page=${page}`,
      {
        header,
      }
    )
    .then(async (response) => {
      const users = response.data;
      const requests = users.items.map((item) => {
        if (item === undefined) {
          return null;
        }
        return axios.get(item.url, {
          header,
        });
      });

      const responses = await Promise.all(requests);

      const users_Info = await Promise.all(
        responses.map(async (user_Info) => {
          if (user_Info) {
            const user = user_Info.data;
            const commit = await getCommitCount(user.html_url);
            return {
              profile_img: user.avatar_url,
              id: user.login,
              url: user.html_url,
              name: user.name,
              bio: user.bio,
              company: user.company,
              public_repos: user.public_repos,
              followers: user.followers,
              following: user.following,
              location: user.location,
              commit: commit,
            };
          }
        })
      );
      if (users_Info.length > 0 || page == 1) {
        users_Info.push({
          total: users.total_count,
        });
      }
      res.send(users_Info);
    })
    .catch((error) => {
      console.log("API 호출 실패:", error.response.status);
      console.log(error.response.data);
    });
});

async function getCommitCount(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const contributionSelector = "h2.f4.text-normal.mb-2";
    const contributionText = $(contributionSelector).text();
    const contributionNum = contributionText.match(/\d+/)[0];
    if (contributionNum >= 0) {
      return contributionNum;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

module.exports = router;
