import BaseDao from "./baseDao";
import Recipe from "../model/recipe";

export default class RecipeDao extends BaseDao {
  constructor() {
    super(Recipe);
  }

  findDetailById(_id: any) {
    return this.model
      .aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: "RecipeIngredient",
            localField: "_id",
            foreignField: "recipe_id",
            as: "recipeIngredients",
          },
        },
        {
          $lookup: {
            from: "Ingredient",
            localField: "recipeIngredients.ingredient_id",
            foreignField: "_id",
            as: "ingredients",
          },
        },
      ])
      .exec();
  }
}
