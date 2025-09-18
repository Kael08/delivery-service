import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Controller('delivery')
export class DeliveryController {
    constructor(
        private readonly deliveryService:DeliveryService
    ) {}


    @Get('hello-world')
    async helloWorld(){
        return {
            data:'hello-world'
        }
    }

    @Post()
    async startDelivery(@Body() dto: CreateDeliveryDto) {
        const client = await this.deliveryService.createApplication(dto.clientId)
        return { status: 'success', client}
    }
}