const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const moment = require("moment");
//Create constance and link to model
const visual_input_table = require("../model/visual_input");

const constance = require("../constance/constance");

router.get("getMasterRfid", async (req, res) => {
  try {
    let data = await visual_input_table.Sequelize.query(`
        SELECT [emp]
              ,[rfid]
              ,[fname]
              ,[lname]
              ,[mfg_date]
          FROM [turning_visual].[dbo].[master_rfid]
          order by [emp]
    `);
    return res.json({ data: data[0], message: constance.result_ok });
  } catch (error) {
    return res.json({ data: [], message: constance.result_nok });
  }
});

router.post("inRFID", async (req, res) => {
  try {
    let data = await visual_input_table.Sequelize.query(`
        INSERT INTO [turning_visual].[dbo].[master_rfid] ([emp],[rfid],[mfg_date])
        VALUES ('${req.body.emp}','${req.body.rfid}',GETDATE())`);
    return res.json({
      data: data[0],
      message: constance.result_ok,
    });
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok });
  }
});

router.post("updateRFID", async (req, res) => {
  try {
    let data = await visual_input_table.Sequelize.query(`
        UPDATE [turning_visual].[dbo].[master_rfid]
        SET rfid = '${req.body.rfid}'
        where emp = '${req.body.emp}'
        `);
        return res.json({ data: data[0], message: constance.result_ok});
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok});
  }
});
module.exports = router;
