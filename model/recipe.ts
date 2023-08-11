import { Schema, model } from "mongoose";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  cover?: string;
  content: string;
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Recipe>(
  {
    title: {
      type: String,
      unique: true,
      maxLength: 150,
      trim: true,
      required: [true, "标题不能为空"],
    },
    description: {
      type: String,
      maxLength: 200,
      trim: true,
      required: [true, "内容不能为空"],
    },
    cover: {
      type: String,
      trim: true,
      maxLength: 100,
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
