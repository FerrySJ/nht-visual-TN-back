const { Sequelize, DataTypes } = require("sequelize");
//SQL Connection
const database = require("../instance/instance");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const table_data_WipStore_McShop = database.define(
  // table name
  "data_WipStore_McShop",
  {
    // column list >>>>>>>
    // id: {
    //   type: Sequelize.INTEGER,
    //   autoIncrement: true,
    //   allowNull: false,
    // },

    registered: {
      type: Sequelize.DATE,
    },
    proC_INV: {
      type: Sequelize.STRING,
      // unique: true,
    },
    loca: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    tranS_YMD: {
      type: Sequelize.DATEONLY,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    parT_NO: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    lotno: {
      type: Sequelize.STRING,
    },
    tranS_CD: {
      type: Sequelize.STRING,
    },
    qty: {
      type: Sequelize.FLOAT,
      unique: "compositeIndex",
    },
    operator: {
      type: Sequelize.STRING,
    },
    barcodE1: {
      type: Sequelize.STRING,
    },
    pC_NAME: {
      type: Sequelize.STRING,
    },
    mainT_DATE: {
      type: Sequelize.STRING,
    },
    mainT_TIME: {
      type: Sequelize.STRING,
    },
    shift: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    tray: {
      type: Sequelize.FLOAT,
      unique: "compositeIndex",
    },
    stick: {
      type: Sequelize.FLOAT,
      unique: "compositeIndex",
    },
    box: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    pos: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    machine: {
      type: Sequelize.STRING,
    },
    nG_CODE: {
      type: Sequelize.STRING,
    },
    mark: {
      type: Sequelize.STRING,
    },
    radi: {
      type: Sequelize.STRING,
    },
    grade: {
      type: Sequelize.STRING,
    },
    syS_YMD: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    transgroup: {
      type: Sequelize.STRING,
    },
    entrY_BY: {
      type: Sequelize.STRING,
    },
    assY_MS: {
      type: Sequelize.STRING,
    },
    seri: {
      type: Sequelize.STRING,
    },
    grP_PART: {
      type: Sequelize.STRING,
    },
    proC_JT: {
      type: Sequelize.STRING,
    },
    proD_SHIFT: {
      type: Sequelize.STRING,
    },
    proD_DATE: {
      type: Sequelize.DATEONLY,
    },
  },
  {
    //option
    // do not delete
    timestamps: false,

    // ตั้งชื่อ Index ให้สื่อความหมาย
    indexes: [
      {
        unique: true,
        fields: [
          "loca",
          "barcode",
          "lotno",
          "qty",
          "shift",
          "tray",
          "stick",
          "box",
          "pos",
        ],
      },
    ],
  }
);

//True : Delete then Create
//False : Only Check then Create

//ชื่อตั่วแปร await,module.exports  ต้องตรงกับข้างบน
(async () => {
  await table_data_WipStore_McShop.sync({ force: false });
})();

module.exports = table_data_WipStore_McShop;
