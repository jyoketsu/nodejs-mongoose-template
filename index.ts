import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// import swaggerDocument from "./swagger.json";
import user from "./router/user";
import ingredient from "./router/ingredient";
import recipe from "./router/recipe";
import favorite from "./router/favorite";

//配置swagger-jsdoc
const options = {
  definition: {
    openapi: "3.1.0",
    // swagger: "2.0",
    info: {
      title: "nodejs-mongoose-template",
      description:
        "nodejs-mongoose-template 的Swagger UI。一些有用的链接。\n- [Swagger docs](https://swagger.io/docs/specification/about/)\n- [Swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)\n- [SwaggerEditor](https://editor-next.swagger.io/)",
      version: "1.0.11",
    },
  },
  // 去哪个路由下收集swagger注释
  apis: ["./router/*.ts"],
};

const openapiSpecification = swaggerDoc(options);

dotenv.config();

const app = express();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI as string);
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

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// 设定路由
app.get("/", function (req: any, res: any) {
  res.send("Hello World");
});
app.use("/user", user);
app.use("/ingredient", ingredient);
app.use("/recipe", recipe);
app.use("/favorite", favorite);

// 启动服务
app.listen(8099, () => {
  console.log("nodejs-mongoose-template:localhost:8099 started!!");
});
