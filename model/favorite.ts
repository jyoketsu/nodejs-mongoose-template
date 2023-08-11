import { Schema, model } from "mongoose";

interface Favorite {
  _id: string;
  user_id: Schema.Types.ObjectId;
  recipe_id: Schema.Types.ObjectId;
  createTime: Date;
  updateTime: Date;
}

const schema = new Schema<Favorite>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipe_id: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
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

const FavoriteModel = model<Favorite>("Favorite", schema);
export default FavoriteModel;
