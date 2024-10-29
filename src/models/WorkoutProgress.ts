import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { ClientWorkout } from "./ClientWorkout";
import { Exercise } from "./Exercise";

@Entity("workout_progress")
export class WorkoutProgress {
    @PrimaryGeneratedColumn("uuid")
    progress_id!: string;

    @ManyToOne(() => ClientWorkout)
    workout!: ClientWorkout;

    @ManyToOne(() => Exercise)
    exercise!: Exercise;

    @Column("int")
    set_number!: number;

    @Column("float", { nullable: true })
    weight!: number;

    @Column("int")
    reps!: number;

    @CreateDateColumn()
    completed_at!: Date;
} 