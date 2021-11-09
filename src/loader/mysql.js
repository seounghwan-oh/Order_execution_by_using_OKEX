import mysql from "mysql2/promise";

export const connection = mysql.createConnection({
  host: "assignment.cdesysm14eie.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "ywmUnbU8bfTY0OirW723",
  port: 3306,
});
