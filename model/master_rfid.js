//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/instance");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const master_rfid_table = database.define(
  // table name
  "master_rfid",
  {
    emp: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    rfid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    fname: {
      type: Sequelize.STRING,
    },
    lname: {
      type: Sequelize.STRING,
    },
    mfg_date: {
      type: Sequelize.DATE,
    },
  },
  {
    //option
    // do not delete
    timestamps: false,
  }
);

//True : Delete then Create
//False : Only Check then Create

//ชื่อตั่วแปร await,module.exports  ต้องตรงกับข้างบน
(async () => {
  await master_rfid_table.sync({ force: false });
})();

module.exports = master_rfid_table;
