import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
