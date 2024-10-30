import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("exercises")
export class Exercise {
    @PrimaryGeneratedColumn("uuid")
    exercise_id!: string;

    @Column()
    name!: string;

    @Column("text")
    description!: string;

    @Column("int", { nullable: true })
    default_rest_time!: number;

    @Column({ nullable: true })
    video_url!: string;
} 