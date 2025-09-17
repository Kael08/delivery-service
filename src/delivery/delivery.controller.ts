import { Controller, Get } from '@nestjs/common';

@Controller('delivery')
export class DeliveryController {

    @Get('hello-world')
    async helloWorld(){
        return {
            data:'hello-world'
        }
    }
}