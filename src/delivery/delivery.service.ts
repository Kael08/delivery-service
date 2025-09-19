import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientResponse } from './interfaces/client.interface'
import { firstValueFrom } from 'rxjs';
import { ApplicationResponse } from './interfaces/application.interface'
import { generateTimePeriods } from './interfaces/timePeriods.inteface';
import { Address } from './interfaces/address.interface'
import { Good } from './interfaces/good.interface';
import { CourierResponse } from './interfaces/courier.interface';
import { PlanningResponse } from './interfaces/planningResponse.interface';
import { AxiosError } from 'axios';

@Injectable()
export class DeliveryService {
    private readonly logger = new Logger(DeliveryService.name)
    private readonly apiUrl: string
    private readonly apiKey: string
    private readonly relogUserId: string
    private readonly relogCompanyId: string
    
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        
    ) {
        this.apiUrl=this.configService.get<string>('RELOG_API_URL') || ''
        this.apiKey=this.configService.get<string>('RELOG_API_KEY') || ''
        this.relogUserId=this.configService.get<string>('RELOG_USER_ID') || ''
        this.relogCompanyId=this.configService.get<string>('RELOG_COMPANY_ID') || ''
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

            console.log(payload)
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

        // Получение курьеров
        const couriersIds= await this.selectCourier()

        if(couriersIds.length===0){
            this.logger.warn('No couriers available for application')
            return applicationId
        }

        // Запуск планирования
        const planningPayload = {
            apps: [applicationId],
            couriers: couriersIds,
            params: {
                routingTimeWindow: {
                    start: 1758225600,
                    end: 1758308340
                },
                algorithmName: 'Vroom',
                useGeozoneAlgorithm: false,
                selectedGeozoneGroup: 'vWJhbdgZ4TpvkH8A3',
                tailStorage: true,
                considerWeight: false,
                considerVolume: false,
                startPoint: 'depot',
                uniformDistribution: 'num_tasks',
                uniformDistributionFactor: 10,
                optimizationConfig: 'optimizeDistance',
                veeroute_config: 'optimize_distance',
                proximityFactor: 5,
                vehicleFixedCost: 0,
                minGoodsPrice: 0,
                combinePointsTurnedOn: true,
                combineServiceTimeTurnedOn: true,
                combineNumberOfTasks: true,
                considerCategory: false,
                considerClient: false,
                considerCourierWorkingShift: false,
                considerPriority: false,
                considerTransportType: false,
                considerCategoryPriority: false,
                avoidTolls: false,
                multiPickup: false,
                appsCompatibility: false,
                minApps: 0,
                maxApps: 60,
                tripDurationTurnedOn: false,
                tripDuration: 1,
                caseVolumeTurnedOn: false,
                caseVolume: 0,
                maxUniquePickups: 0,
                parkingTime: 0,
                addToExistingRoute: false,
                usePlanningScript: false,
                depotLoadingTurnedOn: false,
                depotLoadingCount: 0,
                depotLoadingTime: 0,
                companyId: this.relogCompanyId,
                userId: this.relogUserId,
                actionType: 'planning',
            },
        };

        try {
            const planningResponse: PlanningResponse = await this.startPlanning(planningPayload);
            await this.delay(5000);
            await this.buildPlannedData(planningResponse.jobId);
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response
                ? `Статус: ${axiosError.response.status}, Данные: ${JSON.stringify(axiosError.response.data)}`
                : axiosError.message;
            this.logger.error(`Не удалось создать заявку для клиента ${clientId}: ${errorMessage}`);
            throw new Error(`Не удалось создать заявку: ${errorMessage}`);
        }

        return applicationResponse.data._id
    }

    generateExternalId(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 10);
        return (timestamp + randomPart).substring(0, 16);
    }

    async selectCourier(): Promise<string[]> {
        try {
        const response = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/api/v3/couriers`, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.apiKey,
            },
            }),
        );
        const courierResponse = response.data as CourierResponse;

        const todayDayOfYear = this.getDayOfYear(new Date());
        const currentTimeUTC = new Date().toISOString().slice(11, 19);

        const workingCouriers = courierResponse.data
            .filter((courier) => {
            // Проверка рабочих дней
            const isWorkingToday = courier.workingDays.includes(todayDayOfYear);

            // Проверка времени работы
            const [startHour, startMinute] = courier.workingTime.start.slice(11, 16).split(':').map(Number);
            const [endHour, endMinute] = courier.workingTime.end.slice(11, 16).split(':').map(Number);
            const [currentHour, currentMinute] = currentTimeUTC.split(':').map(Number);
            const startTimeMinutes = startHour * 60 + startMinute;
            const endTimeMinutes = endHour * 60 + endMinute;
            const currentTimeMinutes = currentHour * 60 + currentMinute;
            const isWithinWorkingHours = currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;

            return isWorkingToday && isWithinWorkingHours;
            })
            .map((courier) => courier._id);

        return workingCouriers;
        } catch (error) {
            this.logger.error(`Не удалось получить курьеров`);
            throw new Error(`Не удалось получить курьеров`);
        }
    }

    private getDayOfYear(date: Date): number {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    async startPlanning(payload: any): Promise<PlanningResponse> {
        try {
            const planningUrl = `${this.apiUrl}/api/v3/planning-jobs/start-planning`;
            const response = await firstValueFrom(
            this.httpService.post(planningUrl, payload, {
                headers: {
                'Content-Type': 'application/json',
                'api-key': this.apiKey,
                },
            }),
            );

            // Проверяем статус ответа
            if (response.status === 200 || response.status === 201 || response.status === 208) {
            const planningResponse = response.data as PlanningResponse;
            // Проверяем структуру ответа
            if (!planningResponse.jobId || typeof planningResponse.iterations !== 'number') {
                this.logger.error(`Некорректный формат ответа: ${JSON.stringify(planningResponse)}`);
                throw new Error(`Некорректный формат ответа от API планирования`);
            }
            return {
                jobId: planningResponse.jobId,
                iterations: planningResponse.iterations,
            };
            } else {
            this.logger.error(`Неожиданный статус ответа: ${response.status}, данные: ${JSON.stringify(response.data)}`);
            throw new Error(`Неожиданный статус ответа: ${response.status}`);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response
            ? `Статус: ${axiosError.response.status}, Данные: ${JSON.stringify(axiosError.response.data)}`
            : axiosError.message;
            this.logger.error(`Не удалось запустить планирование: ${errorMessage}`);
            throw new Error(`Не удалось запустить планирование: ${errorMessage}`);
        }
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async buildPlannedData(jobId: string): Promise<void> {
        try {
        const payload = {
            _id: jobId,
            actionType: 'planning',
        };
        const response = await firstValueFrom(
            this.httpService.patch(`${this.apiUrl}/api/v3/planning-jobs/build-planned-data`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.apiKey,
            },
            }),
        );
        this.logger.log(`Build planned data response: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            this.logger.error(`Не удалось назнаить курьера на планирование`)
            throw new Error(`Не удалось назнаить курьера на планирование`)
        }
    }
}
