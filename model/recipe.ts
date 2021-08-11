import { Schema, model } from "mongoose";

interface Recipe {
  title: string;
  content: string;
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Recipe>(
  {
    title: {
      type: String,
      unique: true,
      maxLength: 50,
      trim: true,
      required: [true, "标题不能为空"],
    },
    content: {
      type: String,
      maxLength: 5000,
      trim: true,
      required: [true, "内容不能为空"],
    },
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
const RecipeModel = model<Recipe>("Recipe", schema);
export default RecipeModel;
