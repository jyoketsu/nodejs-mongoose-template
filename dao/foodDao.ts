import BaseDao from "./baseDao";
import Food from "../model/food";

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
}
