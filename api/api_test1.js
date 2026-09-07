//Reference
const express = require("express");
const router = express.Router();
const constance = require("./../constance/constance");

//เป็น sub set ย่อยของ API
//เช่น http:localhost:2005/api/getresult

router.get("/getresult", (req, res) => {
  res.json({ result: constance.result_ok });
});

module.exports = router;
