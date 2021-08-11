import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import UserDao from "../dao/userDao";
import JwtUtil from "../util/jwt";
import { checkEditable } from "../util/checkAuth";
const router = express.Router();

router.get("/", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.findAll();
  res.json({ status: 200, result: result });
});

router.get("/detail", async (req, res) => {
  try {
    let userDao = new UserDao();
    const result = await userDao.findById(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

// 校验
const createValidationChecks = [
  check("username").isLength({ min: 1 }).withMessage("请输入用户名！"),
  check("username").isLength({ max: 50 }).withMessage("用户名最大50个字符！"),
  check("password").isLength({ min: 1 }).withMessage("请输入密码！"),
  check("password").isLength({ max: 50 }).withMessage("密码最大50个字符！"),
];

// 注册
router.post(
  "/register",
  createValidationChecks,
  async (req: Request, res: Response) => {
    // 校验
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    let userDao = new UserDao();
    try {
      // 查看是有有博主
      const hasBloggerRes = await userDao.findOne({
        role: 0,
      });
      // 没有，则当前注册的用户为博主
      let role = hasBloggerRes ? 1 : 0;
      // 创建用户
      const result = await userDao.create({
        username: req.body.username,
        password: req.body.password,
        role: role,
      });
      // 将用户传入并生成token
      let jwt = new JwtUtil(result);
      let token = jwt.generateToken();
      res.json({ status: 200, token: token, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "唯一字段重复！" : "服务出错！",
      });
    }
  }
);

// token登录
router.get("/loginByToken", async (req, res) => {
  let token = req.headers.token;
  let jwt = new JwtUtil(token as string);
  let result = jwt.verifyToken();
  if (result == "err") {
    res.send({ status: 403, msg: "登录已过期,请重新登录" });
  } else {
    // let userDao = new UserDao();
    // const result = await userDao.findById(_id);
    res.json({ status: 200, token: token, result: result });
  }
});

// 登录
router.get("/login", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.findOne({
    username: req.query.username,
    password: req.query.password,
  });
  if (result) {
    // 将用户传入并生成token
    let jwt = new JwtUtil(result);
    let token = jwt.generateToken();
    res.json({ status: 200, token: token, result: result });
  } else {
    res.json({ status: 401, msg: "用户名或者密码错误！" });
  }
});

// 是否有博主
router.get("/blogger", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.findOne({
    role: 0,
  });
  res.json({ status: 200, result: result });
});

// 校验
const updateValidationChecks = [
  check("_id").notEmpty().withMessage("缺少_id！"),
  check("updater").notEmpty().withMessage("缺少参数updater"),
];
// 修改
router.patch(
  "/update",
  updateValidationChecks,
  async (req: Request, res: Response) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    const editable = checkEditable(req, res);
    if (!editable) {
      return;
    }
    try {
      let userDao = new UserDao();
      // 更新
      const result = await userDao.update(
        { _id: req.body._id },
        req.body.updater
      );
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该用户名已存在！" : "服务出错！",
      });
    }
  }
);

// 删除用户
router.delete(
  "/delete",
  [check("_id").notEmpty().withMessage("缺少_id！")],
  async (req: Request, res: Response) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      let userDao = new UserDao();
      // 删除
      const result = await userDao.deleteOne({ _id: req.body._id });
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: "服务出错！",
      });
    }
  }
);

export default router;
