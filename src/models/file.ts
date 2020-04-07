import { Table, Model, Column, IsUUID, PrimaryKey } from 'sequelize-typescript';

export interface FileShape {
  id: string;
}

@Table({ timestamps: true })
export class File extends Model implements FileShape {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id!: string;
}
