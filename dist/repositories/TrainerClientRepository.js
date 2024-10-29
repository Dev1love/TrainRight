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
exports.TrainerClientRepository = void 0;
const typeorm_1 = require("typeorm");
const TrainerClientRelationship_1 = require("../models/TrainerClientRelationship");
class TrainerClientRepository extends typeorm_1.Repository {
    constructor(dataSourceOrManager) {
        if (dataSourceOrManager instanceof typeorm_1.DataSource) {
            super(TrainerClientRelationship_1.TrainerClientRelationship, dataSourceOrManager.createEntityManager());
        }
        else if (dataSourceOrManager instanceof typeorm_1.EntityManager) {
            super(TrainerClientRelationship_1.TrainerClientRelationship, dataSourceOrManager);
        }
        else {
            super(TrainerClientRelationship_1.TrainerClientRelationship, new typeorm_1.EntityManager({
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
    findActiveClients(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({
                where: {
                    trainer: { user_id: trainerId },
                    status: "active"
                },
                relations: ["client"]
            });
        });
    }
    findClientTrainer(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const relationship = yield this.findOne({
                where: {
                    client: { user_id: clientId },
                    status: "active"
                },
                relations: ["trainer"]
            });
            return relationship || undefined;
        });
    }
}
exports.TrainerClientRepository = TrainerClientRepository;
