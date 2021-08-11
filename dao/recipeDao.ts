import BaseDao from "./baseDao";
import Recipe from "../model/recipe";

export default class RecipeDao extends BaseDao {
  constructor() {
    super(Recipe);
  }
}
