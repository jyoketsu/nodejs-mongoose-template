import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import RecipeDao from "../dao/recipeDao";
import { checkEditable } from "../util/checkAuth";
import RecipeIngredientDao from "../dao/recipeIngredientDao";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Recipe
 *   description: 食谱
 */

/**
 * @openapi
 * /recipe/create:
 *   post:
 *     summary: 创建食谱
 *     tags:
 *      - Recipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              cover:
 *                type: string
 *              content:
 *                type: string
 *              ingredientIds:
 *                type: array
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 食谱
 */
const createValidationChecks = [
  check("title").isLength({ min: 1 }).withMessage("请输入标题！"),
  check("title").isLength({ max: 150 }).withMessage("标题最大150个字符！"),
  check("description").isLength({ min: 1 }).withMessage("请输入描述！"),
  check("description")
    .isLength({ max: 200 })
    .withMessage("描述最大200个字符！"),
  check("cover").isLength({ max: 100 }).withMessage("封面最大100个字符！"),
  check("content").isLength({ min: 1 }).withMessage("请输入内容！"),
  check("content").isLength({ max: 5000 }).withMessage("内容最大5000个字符！"),
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
    let recipeDao = new RecipeDao();
    let recipeIngredientDao = new RecipeIngredientDao();
    try {
      const { title, description, cover, content, ingredientIds } = req.body;
      const result = await recipeDao.create({
        title,
        description,
        cover,
        content,
      });
      Promise.all(
        ingredientIds.map((id: string) =>
          recipeIngredientDao.create({
            recipe_id: result._id,
            ingredient_id: id,
          })
        )
      )
        .then((posts) => res.json({ status: 200, result }))
        .catch((error) =>
          res.json({
            status: 500,
            error,
            msg: "服务出错！",
          })
        );
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
 * /recipe/delete/{_id}:
 *   delete:
 *     summary: 删除食谱
 *     tags:
 *      - Recipe
 *     parameters:
 *      - in: path
 *        name: _id
 *        required: true
 *        schema:
 *          type: string
 *        description: 食谱id
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
      let recipeDao = new RecipeDao();
      // 删除
      const result = await recipeDao.deleteOne({ _id });
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
 * /recipe/update:
 *   patch:
 *     summary: 修改食谱
 *     tags:
 *      - Recipe
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
 *         description: 食谱
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
      let recipeDao = new RecipeDao();
      // 更新
      const result = await recipeDao.update(
        { _id: req.body._id },
        req.body.updater
      );
      res.json({ status: 200, result: result });
    } catch (error: any) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "该食谱已存在！" : "服务出错！",
      });
    }
  }
);

/**
 * @openapi
 * /recipe/list:
 *   get:
 *     summary: 获取食谱列表
 *     tags:
 *      - Recipe
 *     responses:
 *       200:
 *         description: 返回食谱列表
 */
router.get("/list", async (req, res) => {
  let recipeDao = new RecipeDao();
  const result = await recipeDao.findAll();
  res.json({ status: 200, result: result });
});

/**
 * @openapi
 * /recipe/detail:
 *   get:
 *     summary: 通过_id获取食谱详情
 *     tags:
 *      - Recipe
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: 食谱id
 *     responses:
 *       200:
 *         description: 食谱详情
 */
router.get("/detail", async (req, res) => {
  try {
    let recipeDao = new RecipeDao();
    const result = await recipeDao.findDetailById(req.query._id);
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
