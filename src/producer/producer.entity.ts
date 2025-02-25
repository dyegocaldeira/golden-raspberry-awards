import { Movies } from '../movie/movie.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producers {
  constructor(name?: string) {
    if (name) this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Movies, (movie) => movie.producers)
  movies: Movies[];
}
