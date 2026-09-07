//Reference
const Sequelize = require("sequelize");
//==================================================================================================
//IP (Not include port)
// Database Name , User Name , Password
//==================================================================================================
const sequelize = new Sequelize("turning_visual", "sa", "BearinG5", {
  host: "PBP143",
  timezone: 'utc+7',
  dialect: "mssql",
  dialectOptions: { 
    options: { 
      instanceName: "NHTBEARING" ,
      encrypt: false,
    } 
  },
});

//==================================================================================================

// SQL Server in localhost
// const sequelize = new Sequelize("turning_visual", "sa", "sa@admin", {
//   server: "PBTN3W", // ถ้า connect db ไม่ได้ (ข้อมูลต้องใส่ถูกแล้วด้วย) ให้เปลี่ยนเป็นน "host"
//   timezone: 'utc+7',
//   dialect: "mssql",
//   dialectOptions: {
//     options: {
//       instanceName: "",
//       encrypt: false,
//     },
//   },
// });

// ==================================================================================================
// SQL Server
// const sequelize = new Sequelize("database_name", "instance_id", "instance_password", {
//   host: "host_name",
//   dialect: "mssql",
//   dialectOptions: {
//    options: {
//       instanceName: "SQLEXPRESS",
//     },
//   },
// });

(async () => {
  await sequelize.authenticate();
})();
module.exports = sequelize;
