import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  nickname: string;

  @Column({ length: 64 })
  password: string;

  @Column({ length: 100 })
  email: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
