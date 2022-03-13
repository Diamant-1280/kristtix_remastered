import { MongoClient, Filter, Sort, OptionalId, UpdateFilter, MatchKeysAndValues } from "mongodb";
export default class MongoDB extends MongoClient {
    private readonly dbName = "krisstix_remastered"

    public login(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connect((err: Error) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

    public async start(): Promise<void> {
        await this.login()
    }

    public constructor(url: string = process.env.dataURL) {
        super(url)
    }

    public getCollection(collection: string) {
        return this.db(this.dbName).collection(collection)
    }

    public async getOne<Schema>(
        collection: string,
        filter?: Filter<Schema>
    ): Promise<Schema> {
        return (await this.getCollection(collection).findOne(
            filter
        )) as unknown as Schema
    }

    public async getMany<Schema>(
        collection: string,
        filter?: Readonly<Filter<Schema>>,
        sort?: Sort
    ): Promise<Schema[]> {
        return (await this.getCollection(collection)
            .find(filter)
            .sort(sort)
            .toArray()
        ) as unknown as Schema[]
    }

    public async insertOne<Schema>(
        collection: string,
        data: OptionalId<Schema>
    ): Promise<Schema> {
        return (await this.getCollection(collection).insertOne(
            data
        )) as unknown as Schema;
    }

    public async insertMany<Schema>(
        collection: string,
        data: OptionalId<Schema>[]
    ): Promise<Schema[]> {
        return (await this.getCollection(collection).insertMany(
            data
        )) as unknown as Schema[];
    }

    public async removeOne<Schema>(
        collection: string,
        filter: Readonly<Filter<Schema>>
    ): Promise<Schema> {
        return (await this.getCollection(collection).deleteOne(
            filter
        )) as unknown as Schema;
    }

    public async removeMany<Schema>(
        collection: string,
        filter: Readonly<Filter<Schema>>
    ): Promise<Schema[]> {
        return (await this.getCollection(collection).deleteMany(
            filter
        )) as unknown as Schema[];
    }

    public async count<Schema>(
        collection: string,
        filter: Readonly<Filter<Schema>>
    ): Promise<Schema> {
        return (await this.getCollection(collection).countDocuments(
            filter
        )) as unknown as Schema;
    }

    public async save<Schema>(
        collection: string,
        data: Readonly<OptionalId<Schema>>
    ): Promise<Schema> {
        return (await this.getCollection(collection).updateOne(
            {
                _id: data._id,
            },
            {
                $set: data,
            }
        )) as unknown as Schema;
    }

    public async updateOne<Schema>(
        collection: string,
        filter: Readonly<Filter<Schema>>,
        $set: Readonly<UpdateFilter<Schema>>,
    ): Promise<Schema> {
        return (await this.getCollection(collection).updateOne(filter, {
            $set,
        })) as unknown as Schema;
    }

    public async updateMany<Schema>(
        collection: string,
        filter: Readonly<Filter<Schema>>,
        $set: Readonly<UpdateFilter<Schema>>
    ): Promise<Schema[]> {
        return (await this.getCollection(collection).updateMany(filter, {
            $set,
        })) as unknown as Schema[];
    }

    public async getOrInsert<Schema>(
		collection: string,
		filter: Filter<Schema>,
		data: OptionalId<Schema>
	): Promise<Schema | OptionalId<Schema>> {
		const document_ = await this.getOne<Schema>(collection, filter);
		if (document_) return document_;
		await this.insertOne<Schema>(collection, data);
		return data;
	}
}