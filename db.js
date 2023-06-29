const mysql2 = require("mysql2");

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "PnK@12345#raJ",
  database: "ecommerce1",
  waitForConnections: true,
  queueLimit: 0,
  connectionLimit: 10,
  port: 3306,
});

module.exports = pool;
