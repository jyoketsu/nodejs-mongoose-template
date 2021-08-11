import { Schema, model } from "mongoose";

// 食材
interface Ingredient {
  name: string;
  cover: string;
  availableMonths: number[];
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Ingredient>(
  {
    name: {
      type: String,
      unique: true,
      maxLength: 50,
      trim: true,
      required: [true, "名字不能为空"],
    },
    cover: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    availableMonths: [
      {
        type: Number,
        min: 1,
        max: 12,
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
const IngredientModel = model<Ingredient>("Ingredient", schema);
export default IngredientModel;
