import { Report } from 'src/reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() email: string;
  @Column() password: string;
  @OneToMany(() => Report, (report) => report.user) reports: Report[];

  @Column({ default: true })
  admin: boolean;

  @Column()
  isDead: boolean;

  @AfterInsert()
  private logInsert() {
    console.log(`Inserted user with id: ${this.id}`);
  }

  @AfterUpdate()
  private logUpdate() {
    console.log(`Updated user with id: ${this.id}`);
  }

  @AfterRemove()
  private logRemove() {
    console.log(`Removed user with id: ${this.id}`);
  }
}
