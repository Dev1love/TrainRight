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
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
class UserRepository extends typeorm_1.Repository {
    constructor(dataSourceOrManager) {
        if (dataSourceOrManager instanceof typeorm_1.DataSource) {
            super(User_1.User, dataSourceOrManager.createEntityManager());
        }
        else if (dataSourceOrManager instanceof typeorm_1.EntityManager) {
            super(User_1.User, dataSourceOrManager);
        }
        else {
            // For testing purposes, we'll create a minimal manager
            super(User_1.User, new typeorm_1.EntityManager({
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
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOne({ where: { email } });
            return user || undefined;
        });
    }
    findByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({ where: { role } });
        });
    }
}
exports.UserRepository = UserRepository;
