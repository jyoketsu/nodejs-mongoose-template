// 引入模块依赖
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
// 创建 token 类
export default class Jwt {
  data: string;
  constructor(data: string) {
    this.data = data;
  }

  //生成token
  generateToken() {
    let data = this.data;
    let created = Math.floor(Date.now() / 1000);
    let cert = fs.readFileSync(path.join(__dirname, "../private.pem")); //私钥 可以自己生成
    let token = jwt.sign(
      {
        data,
        // 有效期：7天
        exp: created + 60 * 60 * 24 * 7,
      },
      { key: cert, passphrase: "jyoketsu" },
      { algorithm: "RS256" }
    );
    return token;
  }

  // 校验token
  verifyToken() {
    let token = this.data;
    let cert = fs.readFileSync(path.join(__dirname, "../public.pem")); //公钥 可以自己生成
    let res;
    try {
      let result: any =
        jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};

      let { exp = 0 } = result,
        current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (e) {
      res = "err";
    }
    return res;
  }
}
