//Reference
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const user_table = require("./../model/user");
const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");

router.get("/getresult", (req, res) => {
  res.json({ result: constance.result_ok });
});

router.post("/test_log", async (req, res) => {
  // console.log(req.body);
  res.json({ api_result: constance.result_ok });
});

//insert
router.post("/insert_", async (req, res) => {
  console.log(req.body.empNumber);

  try {
    // console.log(req.body);
    //!!** ระวังเรื่อง regit/login ถ้าแปลงรหัสที่ regist แล้ว ตอน login ต้องแปลงให้เหมือนด้วย
    req.body.password = bcrypt.hashSync(req.body.password, 8); //convert to hash password

    let insert_result = await user_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ req.body.key2
    //  console.log(insert_result);
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    //  console.log(error);
    res.json({ result: error, api_result: constance.result_nok });
  }
});

//insert  from web
router.post("/insert", async (req, res) => {
  console.log(req.body.empNumber);

  try {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //convert to hash password

    let insert_result = await user_table.sequelize.query(`
    INSERT INTO [material_control].[dbo].[users] ([username],[empNumber],[name],[process],[password],[levelUser],[mail],[timeUpdate],[dateUpdate])
    VALUES ('${req.body.empNumber}','${req.body.empNumber}','${req.body.firstname} ${req.body.lastname}','${req.body.process}','${req.body.password}','${req.body.levelUser}','${req.body.mail}','${req.body.timeUpdate}','${req.body.dateUpdate}')`);
    //  console.log(insert_result);
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    //  console.log(error);
    res.json({ result: error, api_result: constance.result_nok });
  }
});

//insert  from web
router.post("/insert_json", async (req, res) => {
  console.log(req.body.length);

  try {
    for (let index = 0; index < req.body.length; index++) {
      
    req.body[index].password = bcrypt.hashSync(req.body[index].password, 8); //convert to hash password

    let insert_result = await user_table.sequelize.query(`
    INSERT INTO [material_control].[dbo].[users] ([username],[empNumber],[name],[process],[password],[levelUser],[mail],[timeUpdate],[dateUpdate])
    VALUES ('${req.body[index].username}','${req.body[index].empNumber}','${req.body[index].name}','${req.body[index].process}','${req.body[index].password}','${req.body[index].levelUser}','${req.body[index].mail}','${req.body[index].timeUpdate}','${req.body[index].dateUpdate}')`);
    //  console.log(insert_result);
    // res.json({ result: insert_result, api_result: constance.result_ok });
    }
    // res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
     console.log("errererer....",error);
    res.json({ result: error, api_result: constance.result_nok });
  }
});
//register
router.post("/checkuser", async (req, res) => {
  try {
    let result = await user_table.sequelize.query(
      ` SELECT  *
        FROM [material_control].[dbo].[users]
        where [username] = '${req.body.username}' or [empNumber] = '${req.body.username}'`
    );
    //  console.log(result);
    if (result[0].length == 0) {
      // if not found
      res.json({
        result_name: "username_not_found",
        // result: "username_not_found",
        api_result: constance.result_nok,
      });
    } else {
      res.json({
        result_name: "username_found",
        result: result[0],
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    //  console.log(error);
    res.json({ result: error, api_result: constance.result_nok });
  }
});

//select
router.get("/select", async (req, res) => {
  try {
    let result = await user_table.findAll();
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    // console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
//select 1
router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    let db_result = await user_table.findOne({
      // where: { username: req.body.username },
      where: { empNumber: req.body.empNumber },
    });
    // if (db_result[0].length == 0) {
    if (db_result == null) {
      // console.log("db_result",db_result);
      // if not found
      res.json({
        result: "username_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found
      //  console.log("db_resul",db_result);
      if (bcrypt.compareSync(req.body.password, db_result.password)) {
        //password pass
        res.json({
          result: db_result,
          api_result: constance.result_ok,
        });
      } else {
        // console.log("Fail",db_result);

        //password fail
        res.json({
          result: "password Fail",
          api_result: constance.result_nok,
        });
      }
    }
  } catch (error) {
    //  console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});

//test login format
router.post("/login1", async (req, res) => {
  try {
    // console.log(req.body);
    let db_result = await user_table.sequelize.query(
      // where: { empNumber: req.body.empNumber },
      `SELECT [username],[empNumber],[password],[levelUser]
  FROM [material_control].[dbo].[users]
  WHERE [username] = '${req.body.username}'`
    );

    if (db_result == null) {
      // if not found
      res.json({
        error: "username_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found
      if (bcrypt.compareSync(req.body.password, db_result[0][0].password)) {
        //password pass
        res.json({
          result: db_result,
          api_result: constance.result_ok,
        });
      } else {
        //password fail
        res.json({
          error: "password Fail",
          api_result: constance.result_nok,
        });
      }
    }
  } catch (error) {
    // console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});

//check username/emp
router.post("/checkusername", async (req, res) => {
  try {
    let result = await user_table.sequelize.query(
      `SELECT [username],[empNumber],[levelUser]
  FROM [material_control].[dbo].[users]
  where [empNumber] = '${req.body.empNumber}' or [username]= '${req.body.username}'`
    );
    // console.log(result);
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/confirmuser", async (req, res) => {
  try {
    // console.log(req.body);
    let db_result = await user_table.findOne({
      where: { username: req.body.username },
      // where: { empNumber: req.body.empNumber },
    });

    if (db_result == null) {
      // if not found
      res.json({
        error: "username_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found
      if (bcrypt.compareSync(req.body.password, db_result.password)) {
        //password pass
        res.json({
          result: db_result,
          api_result: constance.result_ok,
        });
      } else {
        //password fail
        res.json({
          error: "password Fail",
          api_result: constance.result_nok,
        });
      }
    }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//update
router.put("/update", async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //convert to hash password
    let result = await user_table.update(req.body, {
      where: { empNumber: req.body.empNumber },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//update
router.post("/level", async (req, res) => {
  // console.log("level");
  // console.log(req.body);
  try {
    let result = await user_table.sequelize.query(`
    UPDATE [material_control].[dbo].[users]
	  SET levelUser = '${req.body.levelUser}', process = '${req.body.process}'
	  WHERE empNumber = '${req.body.empNumber}'`);
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//Delete
router.post("/delete", async (req, res) => {
  // console.log(req.body);
  try {
    let result = await user_table.sequelize.query(
      ` DELETE FROM [material_control].[dbo].[users]
      WHERE empNumber = '${req.body.empNumber}'`
    );
    res.json({ result: result[0], api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});

router.post("/searchuser", async (req, res) => {
  console.log(req.body);
  try {
    let result = await user_table.sequelize.query(
      `SELECT ROW_NUMBER() OVER (ORDER BY [empNumber]) AS number,*
      FROM [material_control].[dbo].[users]
      WHERE empNumber LIKE '%${req.body.empNumber}%'
      `
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    //  console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});

router.get("/listuser", async (req, res) => {
  try {
    let db_result = await user_table.sequelize.query(
      ` SELECT ROW_NUMBER() OVER (ORDER BY [empNumber]) AS number, [username],[empNumber]
      ,[name],[process],[password],[levelUser],[mail]
          FROM [material_control].[dbo].[users]`
    );
    res.json({
      result: db_result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});


router.get("/user_process", async (req, res) => {
  try {
    let result = await user_table.sequelize.query(
      `
      SELECT distinct(process) AS process
     FROM [material_control].[dbo].[users]
     ORDER BY process ASC
      `
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    //  console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
module.exports = router;
