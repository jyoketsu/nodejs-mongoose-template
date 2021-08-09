import JwtUtil from "./jwt";
import { Request, Response } from "express";

export function checkEditable(req: Request, res: Response) {
  let token = req.headers.token;
  let jwt = new JwtUtil(token as string);
  let result = jwt.verifyToken();
  if (result == "err") {
    res.send({ status: 403, msg: "登录已过期,请重新登录" });
    return false;
  } else {
    if (result.role > 0) {
      res.send({ status: 405, msg: "没有权限执行此操作！" });
      return false;
    } else {
      return true;
    }
  }
}

export function checkLogin(req: Request, res: Response) {
  let token = req.headers.token;
  let jwt = new JwtUtil(token as string);
  let result = jwt.verifyToken();
  if (result == "err") {
    res.send({ status: 403, msg: "登录已过期,请重新登录" });
    return false;
  } else {
    return true;
  }
}
