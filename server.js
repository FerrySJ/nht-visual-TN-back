const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const router = require("./api/api_test1");

app.use(bodyParser.json()); //ทำให้ API เห็น body ได้
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());
const router = require("./api/api_user");
app.use("/", router);
app.use("/user", require("./api/api_user"));
app.use("/visual_in", require("./api/api_visual_in"));
app.use("/api", require("./api/api_test1")); 
app.use("/api_getData", require("./api/api_getDataWipStoreMcShop")); 
app.use("/register-rfid", require("./api/master_rfid")); 

//================================================
// js run at port 3992
// app.listen(3992, () => { //server
  app.listen(2028, () => { 
  console.log("jBackend is running...");
  
});
