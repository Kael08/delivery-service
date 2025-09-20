import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Controller('delivery')
export class DeliveryController {
    constructor(
        private readonly deliveryService:DeliveryService
    ) {}

    @Post()
    async startDelivery(@Body() dto: CreateDeliveryDto) {
        const client = await this.deliveryService.createApplication(dto.clientName, dto.address, dto.clientPhone, dto.details,
            dto.commentary, dto.domofon, dto.flat, dto.floor, dto.porch
        )
        //const client = await this.deliveryService.createApplication(dto.clientId)
        return { status: 'success' }
    }
}