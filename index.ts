import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import mongoose from "mongoose";
import user from "./router/user";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import swaggerDocument from "./swagger.json";

//配置swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger Petstore - OpenAPI 3.1",
      description:
        "This is a sample Pet Store Server based on the OpenAPI 3.1 specification.  You can find out more about\nSwagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!\nYou can now help us improve the API whether it's by making changes to the definition itself or to the code.\nThat way, with time, we can improve the API in general, and expose some of the new features in OAS3.\n\nSome useful links:\n- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)\n- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)\n- [SwaggerEditor](https://editor-next.swagger.io/)",
      termsOfService: "http://swagger.io/terms/",
      contact: {
        email: "apiteam@swagger.io",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      version: "1.0.11",
    },
  },
  // 去哪个路由下收集 swagger 注释
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

// 启动服务
app.listen(8099, () => {
  console.log("nodejs-mongoose-template started!!");
});
