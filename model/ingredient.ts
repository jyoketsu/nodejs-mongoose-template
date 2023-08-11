import { Schema, model } from "mongoose";

// 食材
interface Ingredient {
  _id: string;
  name: string;
  image: string;
  category: "vegetable" | "meat" | "seafood" | "fruit" | "condiment" | "other";
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
    image: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    category: {
      type: String,
      trim: true,
      maxLength: 20,
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
