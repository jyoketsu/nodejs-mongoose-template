import BaseDao from "./baseDao";
import Menu from "../model/menu";

export default class MenuDao extends BaseDao {
  constructor() {
    super(Menu);
  }
}
