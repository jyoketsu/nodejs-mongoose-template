import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import mongoose, { FilterQuery } from "mongoose";
import FoodDao from "../dao/foodDao";
import { checkEditable } from "../util/checkAuth";
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// 分页获取食物列表
router.get(
  "/",
  [
    check("current").notEmpty().withMessage("缺少页数！"),
    check("pageSize").notEmpty().withMessage("缺少每页数量！"),
  ],
  async (req: Request, res: Response) => {
    // 校验
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      const keyword = req.query.keyword;
      const menu = req.query.menu;
      const current = req.query.current;
      const pageSize = req.query.pageSize;
      let foodDao = new FoodDao();
      let filter: FilterQuery<any> = {};
      if (keyword) {
        filter["$or"] = [{ name: eval("/" + keyword + "/i") }];
      }
      if (menu && typeof menu === "string") {
        filter["menus"] = { $elemMatch: { $eq: ObjectId(menu) } };
      }

      const result = await foodDao.find(
        filter,
        parseInt((current || "1") as string),
        parseInt((pageSize || "100") as string)
      );
      res.json({ status: 200, result: result });
    } catch (error) {
      console.log("---error---", error);
      res.json({
        status: 500,
        error,
        msg: "服务出错！",
      });
    }
  }
);

// 根据id获取食物
router.get("/findById", async (req, res) => {
  try {
    let foodDao = new FoodDao();
    const result = await foodDao.findById(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

// 根据id获取食物详情
router.get("/findByIdDetail", async (req, res) => {
  try {
    let foodDao = new FoodDao();
    const result = await foodDao.findByIdDetail(req.query._id);
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

// 创建食物
router.post(
  "/create",
  [
    check("name").notEmpty().withMessage("缺少参数：name"),
    check("cover").notEmpty().withMessage("缺少参数：cover"),
    check("ingredients").notEmpty().withMessage("缺少参数：ingredients"),
    check("recipe").notEmpty().withMessage("缺少参数：recipe"),
  ],
  async (req: Request, res: Response) => {
    const editable = checkEditable(req, res);
    if (!editable) {
      return;
    }
    // 校验
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    let foodDao = new FoodDao();
    try {
      // 创建
      const result = await foodDao.create({
        name: req.body.name,
        cover: req.body.cover,
        ingredients: req.body.ingredients,
        recipe: req.body.recipe,
        menus: req.body.menus,
      });
      res.json({ status: 200, result: result });
    } catch (error) {
      res.json({
        status: 500,
        error,
        msg: error && error.code === 11000 ? "唯一字段重复！" : "服务出错！",
      });
    }
  }
);

// 修改食物
router.patch(
  "/update",
  [
    check("_id").notEmpty().withMessage("缺少_id！"),
    check("updater").notEmpty().withMessage("缺少参数updater"),
  ],
  async (req: Request, res: Response) => {
    const editable = checkEditable(req, res);
    if (!editable) {
      return;
    }
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      let foodDao = new FoodDao();
      // 更新
      const result = await foodDao.update(
        { _id: req.body._id },
        { ...req.body.updater, updateTime: new Date() }
      );
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

// 删除食物
router.delete(
  "/delete",
  [check("_id").notEmpty().withMessage("缺少_id！")],
  async (req: Request, res: Response) => {
    const editable = checkEditable(req, res);
    if (!editable) {
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 403, errors: errors.mapped() });
    }
    try {
      let foodDao = new FoodDao();
      // 删除
      const result = await foodDao.deleteOne({ _id: req.body._id });
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

// 计数
router.get("/count", async (req, res) => {
  try {
    let foodDao = new FoodDao();
    const result = await foodDao.count({});
    res.json({ status: 200, result: result });
  } catch (error) {
    res.json({
      status: 500,
      error,
      msg: "服务出错！",
    });
  }
});

module.exports = router;
