import { DatabaseFile } from '@pagerr/api-interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'database_file' })
export class DatabaseFileEntity implements DatabaseFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public filename: string;

  @Column({
    type: 'bytea'
  })
  public data: Uint8Array;
}
