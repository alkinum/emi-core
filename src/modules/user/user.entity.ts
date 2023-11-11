import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { ApiKey } from '../api-key/api-key.entity';

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

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];
}
