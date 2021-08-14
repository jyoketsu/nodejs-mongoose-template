import BaseDao from "./baseDao";
import Food from "../model/food";
import { CallbackError, FilterQuery, EnforceDocument } from "mongoose";

export default class FoodDao extends BaseDao {
  constructor() {
    super(Food);
  }

  // 计算各个菜单的菜数
  menuFoodCount() {
    return new Promise((resolve, reject) => {
      this.model
        .aggregate()
        .unwind("menus")
        .group({ _id: "$menus", count: { $sum: 1 } })
        .lookup({
          from: "menus",
          localField: "_id",
          foreignField: "_id",
          as: "menu",
        })
        .unwind("menu")
        .project({ count: 1, name: "$menu.name" })
        .exec(function (err, record) {
          if (err) {
            reject(err);
          } else {
            resolve(record);
          }
        });
    });
  }

  find(
    filter: FilterQuery<any>,
    current: number,
    pageSize: number,
    sorter?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const count = await this.count(filter);
      const skip = (current - 1) * pageSize;
      this.model
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort(sorter ? sorter : { createTime: -1 })
        .exec(function (err: CallbackError, record: EnforceDocument<any, any>) {
          if (err) {
            reject(err);
          } else {
            resolve({ array: record, count: count });
          }
        });
    });
  }

  findByIdDetail(_id: any) {
    return new Promise((resolve, reject) => {
      this.model
        .findById(_id)
        .populate({ path: "ingredients", select: ["name", "cover"] })
        .populate({ path: "recipe", select: "content" })
        .exec(function (err: CallbackError, record: EnforceDocument<any, any>) {
          if (err) {
            reject(err);
          } else {
            resolve(record);
          }
        });
    });
  }
}
