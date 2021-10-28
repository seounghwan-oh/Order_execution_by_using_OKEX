import mysql from "mysql2/promise";

export const connection = mysql.createConnection({
  host: "database-1.cf67lwr9kknh.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "helloworld!",
  port: 3306,
});
