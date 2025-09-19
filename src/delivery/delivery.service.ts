import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientResponse } from './interfaces/client.interface'
import { firstValueFrom } from 'rxjs';
import { ApplicationResponse } from './interfaces/application.interface'
import { generateTimePeriods } from './interfaces/timePeriods.inteface';
import { Address } from './interfaces/address.interface'
import { Good } from './interfaces/good.interface';

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

        // Получаем данные клиента
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

        // Создаем заявку
        let applicationResponse: ApplicationResponse

        try {
            const externalId=this.generateExternalId()

            const addressFrom: Address = {
                address: "Республика Калмыкия, Элиста, улица Кирова, 205",
                coords: {
                    lat: 46.29768726603786,
                    long: 44.28463911132813
                },
                details: "205",
                commentary: "205",
                domofon: "",
                flat: "",
                floor: "",
                porch: "",
                geozoneRoutes: [
                    { name: "Zone 1" }
                ]
            }

            const addressTo: Address = clientResponse.data.addresses[0]

            const good: Good = {
                code: "1",
                name: "Тройная пицца Ассорти",
                volume: 0.5,
                weight: 1.5,
                dimensions: {
                    height: 0.5,
                    width: 1.5,
                    depth: 1.0
                },
                quantity: 1,
                deliveredQuantity: 1,
                price: 790.0,
                requiredSkill: "1",
                caseCoefficient: 2,
                storageAddress: "СВХ"
            }

            const payload = {
                externalId: externalId,
                customId: `app-${externalId}`,
                client: clientResponse.data,
                price: 0,
                ...generateTimePeriods(),
                addressFrom,
                addressTo,
                appType:"delivery",
                volume: 1,
                waitTime: 5,
                loadTime: 3,
                requireTransportSkill:'B',
                priceType:'7xekcArnuGRCMvxuT', // Безнал
                priority: 1,
                reboxInformation: {
                    isEnabled: true,
                    storageId: 'FqTCyH70WtcTkOJPF',
                    smsConfirmation: true
                },
                weight: 1,
                additionalDetails:'Хрупкий товар',
                allDetails:[],
                details:'',
                deliveryPrice:100,
                goods:[good],
                tags: [],
                qrUrl: ''
            }

            const response = await firstValueFrom(
                this.httpService.post(this.apiUrl+`/api/v3/applications/sync`,payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key':this.apiKey
                    }
                })
            )

            applicationResponse = response.data
        } catch(error) {
            this.logger.error('Не удалось создать заявку')
            throw new Error('Не удалось создать заявку')
        }

        const applicationId=applicationResponse.data._id

        

        return applicationResponse.data._id
    }

    generateExternalId(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 10);
        return (timestamp + randomPart).substring(0, 16);
    }
}
