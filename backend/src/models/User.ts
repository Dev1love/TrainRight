import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column()
    role!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 