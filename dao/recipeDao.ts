import BaseDao from "./baseDao";
import Recipe from "../model/recipe";
import mongoose from "mongoose";

export default class RecipeDao extends BaseDao {
  constructor() {
    super(Recipe);
  }

  findDetailById(_id: any) {
    return this.model
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: "recipeingredients",
            localField: "_id",
            foreignField: "recipe_id",
            as: "recipeingredients",
          },
        },
        {
          $lookup: {
            from: "ingredients",
            localField: "recipeingredients.ingredient_id",
            foreignField: "_id",
            as: "ingredients",
          },
        },
        // {
        //   $project: {
        //     ingredients: { name: 1 }, // 保留 ingredients 数组中的 name 字段
        //   },
        // },
      ])
      .exec();
  }
}
