import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("trainer_client_relationships")
export class TrainerClientRelationship {
    @PrimaryGeneratedColumn("uuid")
    relationship_id!: string;

    @ManyToOne(() => User)
    trainer!: User;

    @ManyToOne(() => User)
    client!: User;

    @Column({
        type: "enum",
        enum: ["pending", "active", "terminated"],
        default: "pending"
    })
    status!: string;

    @CreateDateColumn()
    created_at!: Date;
} 