import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { TrainingPlan } from "./TrainingPlan";

@Entity("client_workouts")
export class ClientWorkout {
    @PrimaryGeneratedColumn("uuid")
    workout_id!: string;

    @ManyToOne(() => User)
    client!: User;

    @ManyToOne(() => TrainingPlan)
    plan!: TrainingPlan;

    @Column({
        type: "enum",
        enum: ["in_progress", "completed"],
        default: "in_progress"
    })
    status!: string;

    @CreateDateColumn()
    start_time!: Date;

    @Column({ type: "timestamp", nullable: true })
    end_time!: Date;
} 