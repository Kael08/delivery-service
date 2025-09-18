import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientResponse } from './interfaces/client.interface'
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeliveryService {
    private readonly logger = new Logger(DeliveryService.name)
    private readonly apiUrl: string
    private readonly apiKey: string
    
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        
    ) {
        this.apiUrl=this.configService.get<string>('RELOG_API_URL') || ''
        this.apiKey=this.configService.get<string>('RELOG_API_KEY') || ''
    }

    async createApplication(clientId: string): Promise<string> {
        let clientResponse: ClientResponse

        try {
            const response = await firstValueFrom(
                this.httpService.get(this.apiUrl+`/api/v3/clients/${clientId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key':this.apiKey
                    }
                })
            )

            clientResponse=response.data as ClientResponse
        } catch(error){
            this.logger.error(`Не удалось получить данные клиента`);
            throw new Error(`Не удалось получить данные клиента`);
        }

        return clientResponse.data.name
    }
}
