import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { ClientWorkout } from "./ClientWorkout";
import { User } from "./User";

@Entity("feedback")
export class Feedback {
    @PrimaryGeneratedColumn("uuid")
    feedback_id!: string;

    @ManyToOne(() => ClientWorkout)
    workout!: ClientWorkout;

    @ManyToOne(() => User)
    user!: User;

    @Column("text")
    comment!: string;

    @CreateDateColumn()
    created_at!: Date;
} 