import express from "express";
import morgan from "morgan";
import { router } from "./controller/index.js";
import { connection } from "./loader/mysql.js";

(async () => {
  try {
    const port = 3001;
    const app = express();
    const conn = await connection;
    await conn.connect();
    console.log("Connected to database.");

    app
      .set("json spaces", 2)
      .use(express.json())
      .use(morgan("combined"))
      .use("/api", router)
      .use("/", (req, res) => {
        res.send("API Server");
      });

    app.listen(port, () => {
      console.log(`API Server is Listening to http://localhost:${port}/api`);
    });
  } catch (error) {
    console.log(error);
  }
})();
