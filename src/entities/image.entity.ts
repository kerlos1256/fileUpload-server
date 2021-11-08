import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class file {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  driveId: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  ext: string;

  @Column()
  type: 'image' | 'video' | 'unknown';
}
