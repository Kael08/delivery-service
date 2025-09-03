import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'

@Entity('restaurants')
export class RestaurantEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column({ type: 'varchar', enum: ['open', 'closed']})
    status: string;
}

