import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  resetToken?: string;
  
  @Column({ nullable: true, type: 'timestamp' })
  resetTokenExpires?: Date;
}
