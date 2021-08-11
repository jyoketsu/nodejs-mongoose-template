import BaseDao from "./baseDao";
import Ingredient from "../model/ingredient";

export default class IngredientDao extends BaseDao {
  constructor() {
    super(Ingredient);
  }
}
