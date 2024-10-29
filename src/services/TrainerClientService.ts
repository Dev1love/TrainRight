import { TrainerClientRepository } from "../repositories/TrainerClientRepository";
import { TrainerClientRelationship } from "../models/TrainerClientRelationship";
import { NotFoundError, ValidationError } from "../utils/errors";

export class TrainerClientService {
    constructor(
        private trainerClientRepository: TrainerClientRepository
    ) {}

    async assignClient(trainerId: string, clientId: string): Promise<TrainerClientRelationship> {
        const existingRelationship = await this.trainerClientRepository.findClientTrainer(clientId);
        if (existingRelationship) {
            throw new ValidationError("Client already has an active trainer");
        }

        const relationship = this.trainerClientRepository.create({
            trainer: { user_id: trainerId },
            client: { user_id: clientId },
            status: "pending"
        });

        return this.trainerClientRepository.save(relationship);
    }

    async getTrainerClients(trainerId: string): Promise<TrainerClientRelationship[]> {
        return this.trainerClientRepository.findActiveClients(trainerId);
    }

    async updateRelationshipStatus(
        relationshipId: string, 
        status: "active" | "terminated"
    ): Promise<TrainerClientRelationship> {
        const relationship = await this.trainerClientRepository.findClientTrainer(relationshipId);
        if (!relationship) {
            throw new NotFoundError("Relationship not found");
        }

        relationship.status = status;
        return this.trainerClientRepository.save(relationship);
    }
} 