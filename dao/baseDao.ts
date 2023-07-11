import {
  Model,
  Document,
  CallbackError,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export default class BaseDao {
  model: Model<any, any, any>;
  /**
   * 子类构造传入对应的 Model 类
   *
   * @param model
   */
  constructor(model: Model<any, any, any>) {
    this.model = model;
  }

  /**
   * 使用 Model 的 静态方法 create() 添加 doc
   *
   * @param docs 构造实体的对象
   * @returns {Promise}
   */
  create(docs: object): Promise<any> {
    let entity = new this.model(docs);
    return this.model.create(entity);
  }

  /**
   * 使用 Model save() 添加 doc
   *
   * @param docs 构造实体的对象
   * @returns {Promise}
   */
  save(docs: Document): Promise<any> {
    let entity = new this.model(docs);
    return entity.save();
  }

  findById(_id: any) {
    return this.model.findById(_id).exec();
  }

  /**
   * 查询所有符合条件 docs
   *
   * @param filter 查询条件
   * @param projection 指定要包含或排除哪些 document 字段(也称为查询“投影”)
   * @param options
   * @returns {Promise}
   */
  findAll(
    filter?: FilterQuery<any>,
    projection?: any | null,
    options?: QueryOptions | null
  ): Promise<any> {
    if (filter) {
      return this.model
        .find(filter, projection ? projection : null, options ? options : null)
        .exec();
    } else {
      return this.model.find().exec();
    }
  }

  /**
   * 查找符合条件的第一条 doc
   *
   * @param filter
   * @param projection
   * @param options
   * @returns {Promise}
   */
  findOne(
    filter: FilterQuery<any>,
    projection?: any | null,
    options?: QueryOptions | null
  ): Promise<any> {
    return this.model.findOne(filter, projection, options).exec();
  }

  /**
   * 查找排序之后的第一条
   *
   * @param filter
   * @param orderColumn
   * @param orderType
   * @returns {Promise}
   */
  findOneByOrder(
    filter: FilterQuery<any>,
    orderColumn: any,
    orderType: any
  ): Promise<any> {
    return this.model
      .findOne(filter)
      .sort({ [orderColumn]: orderType })
      .exec();
  }

  /**
   * 更新 docs
   *
   * @param filter 查找条件
   * @param update 更新操作
   * @param options 更新操作
   * @returns {Promise}
   */
  update(
    filter: FilterQuery<any>,
    update?: UpdateQuery<any>,
    options?: QueryOptions | null
  ): Promise<any> {
    return this.model.updateOne(filter, update, options);
  }

  /**
   * 移除 doc
   *
   * @param filter 查找条件
   * @returns {Promise}
   */
  deleteOne(filter?: FilterQuery<any>, options?: QueryOptions): Promise<any> {
    return this.model.deleteOne(filter, options);
  }

  /**
   * 获取数量
   *
   * @param filter
   * @returns {Promise}
   */
  count(filter: FilterQuery<any>): Promise<any> {
    return this.model.countDocuments(filter);
  }
}
