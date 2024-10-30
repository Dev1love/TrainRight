import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { PlanExercise } from "./PlanExercise";

@Entity("training_plans")
export class TrainingPlan {
    @PrimaryGeneratedColumn("uuid")
    plan_id!: string;

    @ManyToOne(() => User)
    trainer!: User;

    @Column()
    plan_name!: string;

    @Column("text")
    description!: string;

    @OneToMany(() => PlanExercise, planExercise => planExercise.plan)
    planExercises!: PlanExercise[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 