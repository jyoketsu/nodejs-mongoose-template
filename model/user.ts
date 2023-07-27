import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface User {
  _id: string;
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  role?: number;
  profile?: string;
  createTime: Date;
  updateTime: Date;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<User>(
  {
    // 用户名
    username: {
      type: String,
      unique: true,
      maxLength: 50,
      trim: true,
      required: [true, "用户名不能为空"],
    },
    // 密码
    password: {
      type: String,
      maxLength: 50,
      trim: true,
      required: [true, "密码不能为空"],
    },
    // 邮箱
    email: {
      type: String,
      maxLength: 50,
      default: "",
    },
    // 头像地址
    avatar: {
      type: String,
      maxLength: 200,
    },
    // 权限：博主：0；用户、游客：1
    role: {
      type: Number,
      default: 1,
    },
    // 个人简介
    profile: {
      type: String,
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
const UserModel = model<User>("User", schema);
export default UserModel;
