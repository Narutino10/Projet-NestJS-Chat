import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PrivateMessage } from './private-message.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emoji: string;

  @Column()
  username: string; // on stocke le username qui a réagi

  @ManyToOne(() => PrivateMessage, (message) => message.reactions, { onDelete: 'CASCADE' })
  message: PrivateMessage;
}
