import { Repository, EntityManager, DataSource, FindOneOptions, ObjectLiteral } from "typeorm";

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    constructor(entity: any, dataSourceOrManager?: DataSource | EntityManager) {
        if (dataSourceOrManager instanceof DataSource) {
            super(entity, dataSourceOrManager.createEntityManager());
        } else if (dataSourceOrManager instanceof EntityManager) {
            super(entity, dataSourceOrManager);
        } else {
            super(entity, new EntityManager({
                "@instanceof": Symbol.for("DataSource"),
                options: {},
                manager: undefined as any,
                name: "default",
                isInitialized: true,
                driver: {
                    options: {},
                    isInitialized: true,
                } as any,
            } as DataSource));
        }
    }

    async findOneOrUndefined(options: FindOneOptions<T>): Promise<T | undefined> {
        const result = await this.findOne(options);
        return result || undefined;
    }
} 