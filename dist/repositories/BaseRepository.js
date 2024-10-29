"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const typeorm_1 = require("typeorm");
class BaseRepository extends typeorm_1.Repository {
    constructor(entity, dataSourceOrManager) {
        if (dataSourceOrManager instanceof typeorm_1.DataSource) {
            super(entity, dataSourceOrManager.createEntityManager());
        }
        else if (dataSourceOrManager instanceof typeorm_1.EntityManager) {
            super(entity, dataSourceOrManager);
        }
        else {
            super(entity, new typeorm_1.EntityManager({
                "@instanceof": Symbol.for("DataSource"),
                options: {},
                manager: undefined,
                name: "default",
                isInitialized: true,
                driver: {
                    options: {},
                    isInitialized: true,
                },
            }));
        }
    }
    findOneOrUndefined(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOne(options);
            return result || undefined;
        });
    }
}
exports.BaseRepository = BaseRepository;
