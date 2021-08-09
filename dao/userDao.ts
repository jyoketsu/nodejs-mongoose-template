import BaseDao from "./baseDao";
import User from "../model/user";

export default class UserDao extends BaseDao {
  constructor() {
    super(User);
  }
}
