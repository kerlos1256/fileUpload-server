import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class file {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  ext: string;

  @Column()
  type: 'image' | 'video' | 'unknown';

  @Column()
  path: string;
}
