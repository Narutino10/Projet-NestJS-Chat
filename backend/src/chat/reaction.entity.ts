import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PrivateMessage } from './private-message.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emoji: string;

  @Column()
  username: string; 

  @Column({ default: 1 })
  count: number;

  @ManyToOne(() => PrivateMessage, (message) => message.reactions, { onDelete: 'CASCADE' })
  message: PrivateMessage;
}
