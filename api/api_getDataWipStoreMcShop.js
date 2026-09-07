// For get data AS400 every 18:10, 06:10
const axios = require("axios");
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const moment = require("moment");
//Create constance and link to model
const table_data_WipStore_McShop = require("../model/dataWipStoreMcShop");

const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
const fs = require("fs");
const path = require("path");

const schedule = require("node-schedule");
const constance = require("../constance/constance");
// every 5 min เพราะเผื่อเวลา user update data AS400
schedule.scheduleJob("--5 * * * *", async function () {
  try {
    const now = moment();
    const hour = parseInt(now.format("HH"));
    const minute = parseInt(now.format("mm"));

    // เช็คช่วง 01:30 - 02:59
    if ((hour === 1 && minute >= 30) || hour === 2) {
      logToFile(
        `${now.format("HH:mm")} : No Run because AS400 Block/Backup data`
      );
    } else {
      syncWipStoreData();
    }
  } catch (error) {
    console.log("error dataWipStoreMcShop: ", error);
  }
});

function logToFile(message) {
  // ดึงวันที่ปัจจุบันและฟอร์แมตเป็น YYYYMMDD
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ""); // แปลงให้เป็น YYYYMMDD
  const logFileName = `logWipStoreTN_${formattedDate}.log`;
  const logFilePath = path.join(
    "D:\\Fern\\Project\\Real Project\\NHT ver18\\NHT\\TN",
    // "C:\\WebApp\\BearingNHT\\Supattra\\TN_Visual\\backend\\logTNvisual",
    logFileName
  );
  // const logFilePath = path.join(__dirname, logFileName);
  const logMessage = `${new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  })} - ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });
}

async function syncWipStoreData() {
  try {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiJCUEFCMDc5IiwiVXNhZ2VQdXJwb3NlTGlzdCI6Ik1TX1BST0RVQ1RJT05fQVBJIiwibmJmIjoxNzI4Mjg2MTM3LCJleHAiOjMzMjUzNTcyNTM3LCJpYXQiOjE3MjgyODYxMzd9.PsYXfYMr0_QvDZLWgIIY_Nbj-qNc7vHL9gqYLX6eK5A`;
    const payload = {
      tranDateFrom: `${moment().format("YYYYMMDD")}`,
      tranDateTo: `${moment().format("YYYYMMDD")}`,
      processLocations: [
        {
          processCode: "0110",
          location: "AF",
        },
        {
          processCode: "0110",
          location: "SEL",
        },
      ],
    };
    let res = await axios.post(
      `https://pbp004.bp.minebea.local/brg-api-dev/api/v1/wip-store/machine-shop/N/data`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent: agent,
      }
    );

    const apiData = res.data;
    const results = { inserted: 0, updated: 0, errors: 0 };

    for (const item of apiData) {
      try {
        // ค้นหาด้วยทุกเงื่อนไขที่รวมเป็น Unique ของคุณ
        const existingRecord = await table_data_WipStore_McShop.findOne({
          where: {
            loca: item.loca,
            barcode: item.barcode,
            lotno: item.lotno,
            qty: item.qty,
            shift: item.shift,
            tray: item.tray,
            stick: item.stick,
            box: item.box,
            pos: item.pos,
          },
        });

        if (existingRecord) {
          // ถ้าเจอชุดข้อมูลนี้อยู่แล้ว -> UPDATE (ถ้าต้องการอัปเดตฟิลด์อื่น เช่นวันที่)
          await existingRecord.update({
            registered: moment().format("YYYY-MM-DD HH:mm:ss"), // หรือค่าอื่นๆ ที่มาจาก API
            loca: item.loca,
            barcode: item.barcode,
            lotno: item.lotno,
            qty: item.qty,
            shift: item.shift,
            tray: item.tray,
            stick: item.stick,
            box: item.box,
            pos: item.pos,
          });
          logToFile(
            `Update database barcode: ${item.barcode}, Qty: ${item.qty} - Date: ${item.tranS_YMD}`
          );
        } else {
          // ถ้าไม่เจอเลย -> INSERT
          await table_data_WipStore_McShop.sequelize.query(`
        INSERT INTO [turning_visual].[dbo].[data_WipStore_McShops] ([registered],[proC_INV],[loca],[tranS_YMD],[barcode],[parT_NO],[lotno],[tranS_CD],[qty],[operator],[barcodE1],[pC_NAME],[mainT_DATE],[mainT_TIME],[shift],[tray],[stick],[box],[pos],[machine],[nG_CODE],[mark],[radi],[grade],[syS_YMD],[type],[transgroup],[entrY_BY],[assY_MS],[seri],[grP_PART],[proC_JT],[proD_SHIFT],[proD_DATE])
        VALUES (GETDATE(),'${item.proC_INV}','${item.loca}','${item.tranS_YMD}','${item.barcode}','${item.parT_NO}','${item.lotno}','${item.tranS_CD}','${item.qty}','${item.operator}','${item.barcodE1}','${item.pC_NAME}','${item.mainT_DATE}','${item.mainT_TIME}','${item.shift}','${item.tray}','${item.stick}','${item.box}','${item.pos}','${item.machine}','${item.nG_CODE}','${item.mark}','${item.radi}','${item.grade}','${item.syS_YMD}','${item.type}','${item.transgroup}','${item.entrY_BY}','${item.assY_MS}','${item.seri}','${item.grP_PART}','${item.proC_JT}','${item.proD_SHIFT}','${item.proD_DATE}')
        `);
          logToFile(
            `Insert database barcode: ${item.barcode}, Qty: ${item.qty} - Date: ${item.tranS_YMD}`
          );
        }
      } catch (err) {
        console.error(`Error processing barcode ${item.barcode}:`, err.message);
        logToFile(
          `(No insert) - Error database barcode: ${item.barcode}, Date: ${item.tranS_YMD} - message: ${err.message}`
        );
      }
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    logToFile(`Error Internal Server Error : ${error.message}`);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในระบบ",
      error: error.message, // ส่งข้อความ Error ไปดูที่หน้าบ้านเพื่อ Debug
    });
  }
}

router.post("/getData", async (req, res) => {
  try {
    const data = await table_data_WipStore_McShop.sequelize.query(`
      SELECT * FROM [turning_visual].[dbo].[data_WipStore_McShops]
      WHERE proD_DATE BETWEEN '${req.body.start_date}' AND '${req.body.end_date}'
      ORDER BY registered DESC
    `);

    const qtyByLoca = data[0].reduce((acc, { loca, qty }) => {
      acc[loca] = (acc[loca] || 0) + qty;
      return acc;
    }, {});

    const summaryArray = Object.keys(qtyByLoca).map((loca) => ({
      loca: loca,
      total_qty: qtyByLoca[loca],
    }));

    res.json({
      result: data[0],
      sumQty: summaryArray,
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.json({ result: error.message, sumQty: [], api_result: constance.result_nok });
    res.status(500).json({ result: "Error fetching data" });
  }
});

module.exports = router;
