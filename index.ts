import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import user from "./router/user";

const app = express();

// 连接数据库
mongoose.connect("mongodb://localhost/nanitabe", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("数据库连接了");
});

app.all("*", function (req: Request, res: Response, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,PATCH,GET,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type,token");
  next();
});

// 设定静态资源
app.use(express.static("public"));

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 设定路由
app.get("/", function (req: any, res: any) {
  res.send("Hello World");
});
app.use("/user", user);

// 启动服务
app.listen(8099, () => {
  console.log("nani-tabe started!!");
});
