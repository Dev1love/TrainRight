import { EntityRepository, Repository } from "typeorm";
import { Exercise } from "../models/Exercise";

@EntityRepository(Exercise)
export class ExerciseRepository extends Repository<Exercise> {
    async searchExercises(query: string): Promise<Exercise[]> {
        return this.createQueryBuilder("exercise")
            .where("exercise.name ILIKE :query OR exercise.description ILIKE :query", 
                   { query: `%${query}%` })
            .getMany();
    }
} 