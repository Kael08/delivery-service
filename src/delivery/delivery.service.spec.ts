import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { beforeEach, describe, it } from 'node:test';

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
