import { Schema, model, models } from "mongoose";

interface Food {
  name: string;
  cover: string;
  // 食材
  ingredients: Schema.Types.ObjectId;
  // 食谱
  recipe: Schema.Types.ObjectId;
  // 所属菜单
  menus: Schema.Types.ObjectId[];
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Food>(
  {
    name: {
      type: String,
      unique: true,
      maxLength: 50,
      trim: true,
      required: [true, "菜名不能为空"],
    },
    cover: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
      },
    ],
    recipe: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
    menus: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

// 3. Create a Model.
// const FoodModel = model<Food>("Food", schema);
// export default FoodModel;
export default models.Food || model<Food>("Food", schema);
