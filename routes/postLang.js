const express = require('express');

const request = require("request");

const router = express.Router();

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";

const isAuth = require('../middleware/is_auth');

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: baseUrl + "select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

router.get('/postLang', isAuth, async (req, res, next) => {
  return res.redirect('/v1/home?page=1&editing=true');
})

module.exports = router;