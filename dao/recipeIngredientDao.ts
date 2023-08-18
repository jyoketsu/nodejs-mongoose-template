import BaseDao from "./baseDao";
import Favorite from "../model/favorite";
import RecipeIngredient from "../model/recipeIngredient";

export default class RecipeIngredientDao extends BaseDao {
  constructor() {
    super(RecipeIngredient);
  }
}
