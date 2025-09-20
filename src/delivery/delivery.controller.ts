import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { WebhookPayload } from './interfaces/webhookPayload.interface';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async startDelivery(@Body() dto: CreateDeliveryDto) {
    const appId = await this.deliveryService.createApplication(
      dto.clientName,
      dto.address,
      dto.clientPhone,
      dto.details,
      dto.commentary,
      dto.domofon,
      dto.flat,
      dto.floor,
      dto.porch,
    );
    return { status: 'success', appId };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: WebhookPayload) {
    console.log('Webhook received:', body);

    // Обработка статуса
    switch (body.statusId) {
      case 'ycdkKj8uY6qRHHM33':
        console.log('Статус заявки: активный');
        break;
      case 'RNg2HchkADzwveCEc':
        console.log('Статус заявки: выехал');
        break;
      case '2MJxwq6WNsjfGfGRD':
        console.log('Статус заявки: ожидаю');
        break;
      case 'WRyRzFKgFsRv7TvWw':
        console.log('Статус заявки: завершен');
        break;
      case 'J5K9fyefg6xHcMxvp':
        console.log('Статус заявкиЖ отказано');
        break;
      default:
        console.log('Неизвестный статус: ', body.statusId);
        break;
    }

    return { status: 'success' }; // Возвращаем 200 OK, чтобы API подтвердил получение
  }
}