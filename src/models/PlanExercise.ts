import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TrainingPlan } from "./TrainingPlan";
import { Exercise } from "./Exercise";

@Entity("plan_exercises")
export class PlanExercise {
    @PrimaryGeneratedColumn("uuid")
    plan_exercise_id!: string;

    @ManyToOne(() => TrainingPlan, plan => plan.planExercises)
    plan!: TrainingPlan;

    @ManyToOne(() => Exercise)
    exercise!: Exercise;

    @Column("int")
    order!: number;

    @Column("int")
    sets!: number;

    @Column("int")
    reps!: number;

    @Column("text", { nullable: true })
    weight_recommendation!: string;
} 