import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { checkEditable } from "../util/checkAuth";
import FavoriteDao from "../dao/favoriteDao";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Favorite
 *   description: 收藏
 */

/**
 * @openapi
 * /favorite/create:
 *   post:
 *     summary: 创建收藏
 *     tags:
 *      - Favorite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: string
 *              recipe_id:
 *                type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 收藏
 */
const createValidationChecks = [
  check("user_id").isLength({ min: 1 }).withMessage("请输入标题！"),
  check("recipe_id").isLength({ min: 1 }).withMessage("请输入标题！"),
];
router.post(
  "/create",
  createValidationChecks,
  async (req: Request, res: Response) => {
    // const editable = checkEditable(req, res);
    // if (!editable) {
    //   return;
    // }
    // 校验
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    let favoriteDao = new FavoriteDao();
    try {
      const result = await favoriteDao.create(req.body);
      res.json({ status: 200, result });
    } catch (error: any) {
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
 * /favorite/delete/{_id}:
 *   delete:
 *     summary: 删除收藏
 *     tags:
 *      - Favorite
 *     parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        schema:
 *          type: string
 *        description: 收藏id
 *     security:
 *       - ApiKeyAuth: []
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
    // const editable = checkEditable(req, res);
    // if (!editable) {
    //   return;
    // }
    try {
      const _id = req.params._id;
      let favoriteDao = new FavoriteDao();
      // 删除
      const result = await favoriteDao.deleteOne({ _id });
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
 * /favorite/list:
 *   get:
 *     summary: 获取收藏列表
 *     tags:
 *      - Favorite
 *     responses:
 *       200:
 *         description: 返回收藏列表
 */
router.get("/list", async (req, res) => {
  let favoriteDao = new FavoriteDao();
  const result = await favoriteDao.findAll();
  res.json({ status: 200, result: result });
});

/**
 * @openapi
 * /favorite/detail:
 *   get:
 *     summary: 通过_id获取收藏详情
 *     tags:
 *      - Favorite
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 收藏id
 *     responses:
 *       200:
 *         description: 收藏详情
 */
router.get("/detail", async (req, res) => {
  try {
    let favoriteDao = new FavoriteDao();
    const result = await favoriteDao.findDetailById(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

export default router;
