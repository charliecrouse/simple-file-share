import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

export interface FileShape {
  id: string;
}

@Table({ timestamps: true })
export class File extends Model implements FileShape {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;

  @Column
  size!: number;
}
