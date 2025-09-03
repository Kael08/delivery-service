import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private restaurantsRepository: Repository<RestaurantEntity>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = this.restaurantsRepository.create(createRestaurantDto);
    return this.restaurantsRepository.save(restaurant);
  }

  async findAll() {
    return this.restaurantsRepository.find({ relations: ['menuItems'] });
  }

  async findOne(id: number) {
    return this.restaurantsRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
  }

  async update(id: number, updateRestaurantDto: CreateRestaurantDto) {
    await this.restaurantsRepository.update(id, updateRestaurantDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.restaurantsRepository.delete(id);
    return { message: `Restaurant with ID ${id} deleted` };
  }
}