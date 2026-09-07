//Reference
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const moment = require("moment");
//Create constance and link to model
const visual_input_table = require("../model/visual_input");
const table_logreq = require("../model/log_visual");

const constance = require("../constance/constance");

//select all req
router.post("/find_req", async (req, res) => {
  try {
    let result = await visual_input_table.sequelize.query(
      `SELECT  [id],[reqno],[registered],[shift],[mfg_date],[oper],[prod_date]
      ,[shifts],[mc_no],[part],[pos],[box],[type],[qtyOk],[qtyNg],[rejBy],[caseNg]
      FROM [turning_visual].[dbo].[visual_inputs]
      WHERE mfg_date BETWEEN '${req.body.start_date}' AND '${req.body.end_date}'
      ORDER BY reqno DESC`
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

//count number
router.get("/countdate", async (req, res) => {
  try {
    let result = await visual_input_table.sequelize.query(
      `
      SELECT DISTINCT(reqno) AS reqno
      FROM [turning_visual].[dbo].[visual_inputs]
      WHERE FORMAT([registered], 'yyyy-MM-dd') = FORMAT(GETDATE(), 'yyyy-MM-dd')
      ORDER BY reqno DESC`
    );
    res.json({ result: result[0] });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

router.post("/api_get_mc", async (req, res) => {
  try {
    const axios = require("axios");
    const fs = require("fs");
    const https = require("https");
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJCUFQxMTMwIiwiZGl2aXNpb24iOiJUMjc2R0EiLCJhcGluYW1lIjoiU1RLSU5WIiwiZXhwIjoxNzU3Mzg5ODEzLCJpc3MiOiJERVYiLCJhdWQiOiJodHRwOi8vZGV2X2RlbW8uY29tIn0.SqanPrCFTSIPHfvj2LDxowqRPsWy1SNrcN-v38VcCMg`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    let result = await axios.get(
      `https://pbp004/brg-api-dev/api/v1/general-masters/turning-masters/N?Machine=${req.body.mc_no}`,
      { httpsAgent: agent }
      // { headers: { Authorization: `Bearer ${token}` }, httpsAgent: agent }
    );
    res.json({ result: result.data, api_result: constance.result_ok });
  } catch (err) {
    console.log(err);
    res.json({ result: err, api_result: constance.result_nok });
  }
});

// API GET DATA PROD as400
router.post("/api_get_prod", async (req, res) => {
  try {
    const axios = require("axios");
    const fs = require("fs");
    const https = require("https");
    const agent = new https.Agent({ rejectUnauthorized: false });
    let result = await axios.get(
      `https://wbp04/brg-api-dev/api/v1/production-result/machine-shop/N/group-part/?start=${req.body.prod_date}&end=${req.body.prod_date}`,
      { httpsAgent: agent }
    );
    res.json({ result: result.data, api_result: constance.result_ok });
  } catch (err) {
    console.log(err);
    res.json({ result: err, api_result: constance.result_nok });
  }
});

// insert
router.post("/in_data_visual", async (req, res) => {
  try {
    let rows = req.body.rows;

    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].mc === "" &&
        rows[i].part === "" 
        // rows[i].rejBy === "" &&
        // rows[i].caseNg === ""
      ) {
        // Not insert
        console.log("No");
      } else {
        console.log("Yesssssss");
        await visual_input_table.sequelize.query(
          `INSERT INTO [turning_visual].[dbo].[visual_inputs] ([reqno],[registered],[shift],[mfg_date],[oper],[prod_date],[shifts],[mc_no],[part],[pos],[box],[type],[qtyOk],[qtyNg],[rejBy],[caseNg])
        VALUES ('${req.body.reqno}',GETDATE() ,'${req.body.shifts}','${req.body.mfg_date}','${req.body.oper}','${rows[i].prod_date}'
        ,'${rows[i].shift}','${rows[i].mc}','${rows[i].part}','${rows[i].pos}','${rows[i].box}','${rows[i].type}','${rows[i].qtyOk}','${rows[i].qtyNg}','${rows[i].rejBy}','${rows[i].caseNg}')`
        );
      }
    }
    res.json({ api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

// insert
router.post("/log_in_data_visual", async (req, res) => {
  try {
    let result = await visual_input_table.sequelize.query(
      `INSERT INTO [turning_visual].[dbo].[log_visuals] ([reqno],[registered],[oper],[shift])
      VALUES ('${req.body.reqno}',GETDATE(),'${req.body.oper}' ,'${req.body.shifts}')`
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});


module.exports = router;
