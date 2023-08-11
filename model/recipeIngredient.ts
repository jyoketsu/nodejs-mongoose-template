import { Schema, model } from "mongoose";

interface RecipeIngredient {
  recipe_id: Schema.Types.ObjectId;
  ingredient_id: Schema.Types.ObjectId;
}

const schema = new Schema<RecipeIngredient>({
  recipe_id: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  ingredient_id: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient",
  },
});

const RecipeIngredientModel = model<RecipeIngredient>(
  "RecipeIngredient",
  schema
);
export default RecipeIngredientModel;
