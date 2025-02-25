import { Producers } from '../producer/producer.entity';
import { Studios } from '../studio/studio.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Movies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  title: string;

  @Column()
  winner: boolean;

  @ManyToMany(() => Producers, (producer) => producer.movies)
  @JoinTable()
  producers: Producers[];

  @ManyToMany(() => Studios, (studio) => studio.movies)
  @JoinTable()
  studios: Studios[];
}
