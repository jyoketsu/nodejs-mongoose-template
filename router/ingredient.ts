import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import IngredientDao from "../dao/ingredientDao";
import { checkEditable } from "../util/checkAuth";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Ingredient
 *   description: 食材
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: token
 */

/**
 * @openapi
 * /ingredient/create:
 *   post:
 *     summary: 创建食材
 *     tags:
 *      - Ingredient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              image:
 *                type: string
 *              category:
 *                type: string
 *              availableMonths:
 *                type: array
 * 								items:
 * 									type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 食材
 */
const createValidationChecks = [
  check("name").isLength({ min: 1 }).withMessage("请输入名称！"),
  check("name").isLength({ max: 50 }).withMessage("名称最大50个字符！"),
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
    let ingredientDao = new IngredientDao();
    try {
      const result = await ingredientDao.create(req.body);
      res.json({ status: 200, result });
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
 * /ingredient/delete/{_id}:
 *   delete:
 *     summary: 删除食材
 *     tags:
 *      - Ingredient
 *     parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        schema:
 *          type: string
 *        description: 食材id
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
      let ingredientDao = new IngredientDao();
      // 删除
      const result = await ingredientDao.deleteOne({ _id });
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
 * /ingredient/update:
 *   patch:
 *     summary: 修改食材
 *     tags:
 *      - Ingredient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              updater:
 *                type: object
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 食材
 *       403:
 *         description: 输入错误
 *       500:
 *         description: 错误
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
    // const editable = checkEditable(req, res);
    // if (!editable) {
    //   return;
    // }
    try {
      let ingredientDao = new IngredientDao();
      // 更新
      const result = await ingredientDao.update(
        { _id: req.body._id },
        req.body.updater
      );
      res.json({ status: 200, result: result });
    } catch (error: any) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该食材已存在！" : "服务出错！",
      });
    }
  }
);

/**
 * @openapi
 * /ingredient/list:
 *   get:
 *     summary: 获取食材列表
 *     tags:
 *      - Ingredient
 *     responses:
 *       200:
 *         description: 返回食材列表
 */
router.get("/list", async (req, res) => {
  let ingredientDao = new IngredientDao();
  const result = await ingredientDao.findAll();
  res.json({ status: 200, result: result });
});

/**
 * @openapi
 * /ingredient/detail:
 *   get:
 *     summary: 通过_id获取食材详情
 *     tags:
 *      - Ingredient
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 食材id
 *     responses:
 *       200:
 *         description: 食材详情
 */
router.get("/detail", async (req, res) => {
  try {
    let ingredientDao = new IngredientDao();
    const result = await ingredientDao.findById(req.query._id);
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
