const express = require("express");
const router = express.Router();

//Create constance and link to model
const master_rfid_table = require("../model/master_rfid");
const constance = require("../constance/constance");

//select all
router.get("/getMasterRfid", async (req, res) => {
  try {
    let data = await master_rfid_table.sequelize.query(`
      SELECT [emp], [rfid], [fname], [lname], [mfg_date]
      FROM [turning_visual].[dbo].[master_rfid]
      ORDER BY [emp]
    `);

    return res.json({ data: data[0], message: constance.result_ok });
  } catch (error) {
    return res.json({ data: [], message: constance.result_nok });
  }
});

//check rfid (FORM VISUAL TURNING)
router.post("/checkRfid", async (req, res) => {
  try {
    let rfid = req.body.rfid;

    if (!rfid) {
      return res.json({ data: "missing_field", message: constance.result_nok });
    }

    let check = await master_rfid_table.sequelize.query(`
      SELECT [emp], [rfid], [fname], [lname]
      FROM [turning_visual].[dbo].[master_rfid]
      WHERE [rfid] = '${rfid}'
    `);

    if (check[0].length > 0) {
      return res.json({ data: check[0][0], message: constance.result_ok });
    }

    // ไม่พบบัตรนี้ในระบบ
    return res.json({ data: null, message: constance.result_nok });
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok });
  }
});

//insert
router.post("/inRFID", async (req, res) => {
  try {
    let emp = req.body.emp;
    let rfid = req.body.rfid;
    let fname = req.body.fname || "";
    let lname = req.body.lname || "";

    if (!emp || !rfid) {
      return res.json({ data: "missing_field", message: constance.result_nok });
    }

    // check emp/rfid ซ้ำก่อน insert
    let check = await master_rfid_table.sequelize.query(`
      SELECT [emp], [rfid]
      FROM [turning_visual].[dbo].[master_rfid]
      WHERE [emp] = '${emp}' OR [rfid] = '${rfid}'
    `);

    if (check[0].length > 0) {
      let is_dup_emp = check[0][0].emp === emp;
      return res.json({
        data: is_dup_emp ? "dup_emp" : "dup_rfid",
        message: constance.result_nok,
      });
    }

    let data = await master_rfid_table.sequelize.query(`
      INSERT INTO [turning_visual].[dbo].[master_rfid] ([emp], [rfid], [fname], [lname], [mfg_date])
      VALUES ('${emp}', '${rfid}', '${fname}', '${lname}', GETDATE())
    `);

    return res.json({ data: data[0], message: constance.result_ok });
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok });
  }
});

//update
router.post("/updateRFID", async (req, res) => {
  try {
    let emp = req.body.emp;
    let rfid = req.body.rfid;
    let fname = req.body.fname || "";
    let lname = req.body.lname || "";

    if (!emp || !rfid) {
      return res.json({ data: "missing_field", message: constance.result_nok });
    }

    // เช็คว่า rfid นี้ถูกใช้โดยพนักงานคนอื่นอยู่แล้วหรือไม่
    let check = await master_rfid_table.sequelize.query(`
      SELECT [emp]
      FROM [turning_visual].[dbo].[master_rfid]
      WHERE [rfid] = '${rfid}' AND [emp] != '${emp}'
    `);

    if (check[0].length > 0) {
      return res.json({ data: "dup_rfid", message: constance.result_nok });
    }

    let data = await master_rfid_table.sequelize.query(`
      UPDATE [turning_visual].[dbo].[master_rfid]
      SET [rfid] = '${rfid}', [fname] = '${fname}', [lname] = '${lname}'
      WHERE [emp] = '${emp}'
    `);

    return res.json({ data: data[0], message: constance.result_ok });
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok });
  }
});

//delete
router.post("/deleteRFID", async (req, res) => {
  try {
    let emp = req.body.emp;

    if (!emp) {
      return res.json({ data: "missing_field", message: constance.result_nok });
    }

    let data = await master_rfid_table.sequelize.query(`
      DELETE FROM [turning_visual].[dbo].[master_rfid]
      WHERE [emp] = '${emp}'
    `);

    return res.json({ data: data[0], message: constance.result_ok });
  } catch (error) {
    return res.json({ data: error.message, message: constance.result_nok });
  }
});

module.exports = router;
