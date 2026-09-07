//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/instance");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const visual_input_table = database.define(
  // table name
  "visual_input",
  {
    // column list >>>>>>>
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   allowNull: false,
    // },
    reqno: {
      type: Sequelize.STRING,
    },
    registered: {
      type: Sequelize.DATE,
    },
    shift: {
      type: Sequelize.STRING,
    },
    mfg_date: {
      type: Sequelize.DATEONLY,
    },
    oper: {
      type: Sequelize.STRING,
    },
    prod_date: {
      type: Sequelize.DATEONLY,
    },
    shifts: {
      type: Sequelize.STRING,
    },
    mc_no: {
      type: Sequelize.STRING,
    },
    part: {
      type: Sequelize.STRING,
    },
    pos: {
      type: Sequelize.FLOAT,
    },
    box: {
      type: Sequelize.FLOAT,
    },
    type: { // OK/NG
      type: Sequelize.STRING
    },
    qtyOk: {
      type: Sequelize.FLOAT,
    },
    qtyNg: {
      type: Sequelize.FLOAT,
    },
    rejBy: {
      type: Sequelize.STRING,
    },
    caseNg: {
      type: Sequelize.STRING,
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
  await visual_input_table.sync({ force: false });
})();

module.exports = visual_input_table;
