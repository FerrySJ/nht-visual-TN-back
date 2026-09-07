//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/instance");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const table_logreq = database.define(
  // table name
  "log_visual",
  {
    // column list >>>>>>>
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   allowNull: false,
    // },
    reqno: {
      type: Sequelize.STRING,
      // unique: true, 
    },
    registered: {
      type: Sequelize.DATE,
    },
    oper: {
      type: Sequelize.STRING,
    },
    shift: {
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
  await table_logreq.sync({ force: false });
})();

module.exports = table_logreq;
