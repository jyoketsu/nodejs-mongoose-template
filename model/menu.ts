import { Schema, model } from "mongoose";

// 菜单
interface Menu {
  name: string;
  describe: string;
  cover: string;
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Menu>(
  {
    name: {
      type: String,
      unique: true,
      maxLength: 50,
      trim: true,
      required: [true, "名字不能为空"],
    },
    describe: { type: String, maxLength: 200, trim: true },
    cover: {
      type: String,
      trim: true,
      maxLength: 500,
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
const MenuModel = model<Menu>("Menu", schema);
export default MenuModel;
