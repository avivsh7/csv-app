import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  band: string;

  @Column()
  song_name: string;

  @Column({ type: 'int', nullable: true })
  year: number | null;
}