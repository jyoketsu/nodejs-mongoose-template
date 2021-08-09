import { Schema, model } from "mongoose";

let userSchema = new Schema(
  {
    // 用户名
    username: {
      type: String,
      unique: true,
      max: 50,
      trim: true,
      required: [true, "用户名不能为空"],
    },
    // 密码
    password: {
      type: String,
      max: 50,
      trim: true,
      required: [true, "密码不能为空"],
    },
    // 邮箱
    email: {
      type: String,
      max: 50,
      default: "",
    },
    // 头像地址
    avatar: {
      type: String,
      max: 200,
    },
    // 权限：博主：0；用户、游客：1
    role: {
      type: Number,
      default: 1,
    },
    // 个人简介
    profile: {
      type: String,
      max: 500,
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

const UserModel = model("User", userSchema);
export default UserModel;
