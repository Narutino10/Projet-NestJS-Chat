import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reaction } from './reaction.entity';

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

  @OneToMany(() => Reaction, (reaction) => reaction.message)
  reactions: Reaction[];
}
