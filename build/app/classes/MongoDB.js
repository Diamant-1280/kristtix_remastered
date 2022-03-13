"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class MongoDB extends mongodb_1.MongoClient {
    constructor(url = process.env.dataURL) {
        super(url);
        this.dbName = "krisstix_remastered";
    }
    login() {
        return new Promise((resolve, reject) => {
            this.connect((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async start() {
        await this.login();
    }
    getCollection(collection) {
        return this.db(this.dbName).collection(collection);
    }
    async getOne(collection, filter) {
        return (await this.getCollection(collection).findOne(filter));
    }
    async getMany(collection, filter, sort) {
        return (await this.getCollection(collection)
            .find(filter)
            .sort(sort)
            .toArray());
    }
    async insertOne(collection, data) {
        return (await this.getCollection(collection).insertOne(data));
    }
    async insertMany(collection, data) {
        return (await this.getCollection(collection).insertMany(data));
    }
    async removeOne(collection, filter) {
        return (await this.getCollection(collection).deleteOne(filter));
    }
    async removeMany(collection, filter) {
        return (await this.getCollection(collection).deleteMany(filter));
    }
    async count(collection, filter) {
        return (await this.getCollection(collection).countDocuments(filter));
    }
    async save(collection, data) {
        return (await this.getCollection(collection).updateOne({
            _id: data._id,
        }, {
            $set: data,
        }));
    }
    async updateOne(collection, filter, $set) {
        return (await this.getCollection(collection).updateOne(filter, {
            $set,
        }));
    }
    async updateMany(collection, filter, $set) {
        return (await this.getCollection(collection).updateMany(filter, {
            $set,
        }));
    }
    async getOrInsert(collection, filter, data) {
        const document_ = await this.getOne(collection, filter);
        if (document_)
            return document_;
        await this.insertOne(collection, data);
        return data;
    }
}
exports.default = MongoDB;
//# sourceMappingURL=MongoDB.js.map