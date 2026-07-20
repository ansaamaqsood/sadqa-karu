//const mysql = require("mysql2");

//const db = mysql.createConnection({
 // host:     "localhost",
 // user:     "root",
 // password: "root123",  // your MySQL password
 // database: "sadqa_karu"
//});

//db.connect((err) => {
  //if (err) {
   // console.log("Database connection failed:", err);
  //} else {
   //console.log("MySQL Connected!");
  //}
//});
//
//module.exports = db;
require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME     || "sadqa_karu",
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected!");
  }
});

module.exports = db;