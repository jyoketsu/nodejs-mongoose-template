import {
  Model,
  Document,
  CallbackError,
  EnforceDocument,
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
    return new Promise((resolve, reject) => {
      let entity = new this.model(docs);
      this.model.create(entity, (error, result) => {
        if (error) {
          console.log("create error--> ", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 使用 Model save() 添加 doc
   *
   * @param docs 构造实体的对象
   * @returns {Promise}
   */
  save(docs: Document): Promise<any> {
    return new Promise((resolve, reject) => {
      let entity = new this.model(docs);
      entity.save((error: CallbackError, result: EnforceDocument<any, any>) => {
        if (error) {
          console.log("save error--> ", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  findById(_id: any) {
    return new Promise((resolve, reject) => {
      this.model.findById(
        _id,
        (error: CallbackError, results: EnforceDocument<any, any>) => {
          if (error) {
            console.log("findById error--> ", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
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
    return new Promise((resolve, reject) => {
      if (filter) {
        this.model.find(
          filter,
          projection ? projection : null,
          options ? options : null,
          (error, results) => {
            if (error) {
              console.log("findAll error--> ", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      } else {
        this.model.find((error, results) => {
          if (error) {
            console.log("findAll error--> ", error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      }
    });
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
    return new Promise((resolve, reject) => {
      this.model.findOne(filter, projection, options, (error, results) => {
        if (error) {
          console.log("findOne error--> ", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * 查找排序之后的第一条
   *
   * @param filter
   * @param orderColumn
   * @param orderType
   * @returns {Promise}
   */
  findOneByOrder(filter: FilterQuery<any>, orderColumn: any, orderType: any) {
    return new Promise((resolve, reject) => {
      this.model
        .findOne(filter)
        .sort({ [orderColumn]: orderType })
        .exec(function (err: CallbackError, record: EnforceDocument<any, any>) {
          console.log(record);
          if (err) {
            reject(err);
          } else {
            resolve(record);
          }
        });
    });
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
    return new Promise((resolve, reject) => {
      this.model.updateOne(filter, update, options, (error, results) => {
        if (error) {
          console.log("update error--> ", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * 移除 doc
   *
   * @param filter 查找条件
   * @returns {Promise}
   */
  deleteOne(filter?: FilterQuery<any>, options?: QueryOptions): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.model.deleteOne(filter, options, (error) => {
        if (error) {
          console.log("remove error--> ", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 获取数量
   *
   * @param filter
   * @returns {Promise}
   */
  count(filter: FilterQuery<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.countDocuments(filter, (error, results) => {
        if (error) {
          console.log("countDocuments error--> ", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}
