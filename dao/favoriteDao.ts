import BaseDao from "./baseDao";
import Favorite from "../model/favorite";

export default class FavoriteDao extends BaseDao {
  constructor() {
    super(Favorite);
  }

  findDetailById(_id: any) {
    return this.model
      .findById(_id)
      .populate({ path: "recipe_id", select: "content" })
      .exec();
  }
}
