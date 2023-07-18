import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import UserDao from "../dao/userDao";
import JwtUtil from "../util/jwt";
import { checkEditable } from "../util/checkAuth";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: User
 *   description: 用户管理、用户注册与登录
 */

/**
 * @openapi
 * /user:
 *   get:
 *     summary: 获取用户列表
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: 返回用户列表
 */
router.get("/", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.findAll();
  res.json({ status: 200, result: result });
});

/**
 * @openapi
 * /user/detail:
 *   get:
 *     summary: 通过_id获取用户详情
 *     tags:
 *      - User
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户id
 *     responses:
 *       200:
 *         description: 用户详情
 */
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

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: 用户注册
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         description: A user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
 *                 result:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type:string;
 *                     password:
 *                       type:string;
 *                     email:
 *                       type:string;
 *                     role:
 *                       type:integer
 *                       format:int64
 *                     _id:
 *                       type:string
 *       403:
 *         description: 输入错误
 *       500:
 *         description: 错误
 */
const createValidationChecks = [
  check("username").isLength({ min: 1 }).withMessage("请输入用户名！"),
  check("username").isLength({ max: 50 }).withMessage("用户名最大50个字符！"),
  check("password").isLength({ min: 1 }).withMessage("请输入密码！"),
  check("password").isLength({ max: 50 }).withMessage("密码最大50个字符！"),
];
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
      res.json({ status: 200, token, result });
    } catch (error: any) {
      console.log("---error---", error);
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "唯一字段重复！" : "服务出错！",
      });
    }
  }
);

/**
 * @openapi
 * /user/loginByToken:
 *   get:
 *     description: 通过token登录
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: 用户详情
 */
router.get("/loginByToken", async (req, res) => {
  let token = req.headers.token;
  let jwt = new JwtUtil(token as string);
  let result = jwt.verifyToken();
  if (result == "err") {
    res.send({ status: 403, msg: "登录已过期,请重新登录" });
  } else {
    res.json({ status: 200, token: token, result: result });
  }
});

/**
 * @openapi
 * /user/login:
 *   get:
 *     description: 用户名&密码登录
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: 用户名
 *         required: true
 *         type: string
 *       - name: password
 *         description: 密码
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 用户详情
 */
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

/**
 * @openapi
 * /user/super:
 *   get:
 *     description: 获取超管
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: 超管
 */
router.get("/super", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.findOne({
    role: 0,
  });
  res.json({ status: 200, result: result });
});

/**
 * @openapi
 * /update:
 *   patch:
 *     description: 修改用户
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: 用户id
 *         required: true
 *         type: string
 *       - name: updater
 *         description: 要更新的用户属性
 *         required: true
 *         type: object
 *     responses:
 *       200:
 *         description: 用户
 */
const updateValidationChecks = [
  check("_id").notEmpty().withMessage("缺少_id！"),
  check("updater").notEmpty().withMessage("缺少参数updater"),
];
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
    } catch (error: any) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该用户名已存在！" : "服务出错！",
      });
    }
  }
);

/**
 * @openapi
 * /user/delete/{_id}:
 *   delete:
 *     summary: 删除用户
 *     tags:
 *      - User
 *     parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        schema:
 *          type: string
 *        description: 用户id
 *     responses:
 *       200:
 *         description: OK
 */
router.delete(
  "/delete/:_id",
  [check("_id").notEmpty().withMessage("缺少_id！")],
  async (req: Request, res: Response) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      const _id = req.params._id;
      let userDao = new UserDao();
      // 删除
      const result = await userDao.deleteOne({ _id });
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

/**
 * @openapi
 * /user/count:
 *   get:
 *     description: 获取用户数量
 *     tags:
 *      - User
 *     responses:
 *       200:
 *         description: 用户数量
 */
router.get("/count", async (req, res) => {
  let userDao = new UserDao();
  const result = await userDao.count({});
  res.json({ status: 200, result: result });
});

export default router;
