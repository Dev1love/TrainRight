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
exports.TrainerClientService = void 0;
const errors_1 = require("../utils/errors");
class TrainerClientService {
    constructor(trainerClientRepository) {
        this.trainerClientRepository = trainerClientRepository;
    }
    assignClient(trainerId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingRelationship = yield this.trainerClientRepository.findClientTrainer(clientId);
            if (existingRelationship) {
                throw new errors_1.ValidationError("Client already has an active trainer");
            }
            const relationship = this.trainerClientRepository.create({
                trainer: { user_id: trainerId },
                client: { user_id: clientId },
                status: "pending"
            });
            return this.trainerClientRepository.save(relationship);
        });
    }
    getTrainerClients(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.trainerClientRepository.findActiveClients(trainerId);
        });
    }
    updateRelationshipStatus(relationshipId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const relationship = yield this.trainerClientRepository.findClientTrainer(relationshipId);
            if (!relationship) {
                throw new errors_1.NotFoundError("Relationship not found");
            }
            relationship.status = status;
            return this.trainerClientRepository.save(relationship);
        });
    }
}
exports.TrainerClientService = TrainerClientService;
