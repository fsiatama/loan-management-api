import { Test, TestingModule } from '@nestjs/testing';
import { AzureB2cService } from './azure-b2c.service';

describe('AzureB2cService', () => {
  let service: AzureB2cService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureB2cService],
    }).compile();

    service = module.get<AzureB2cService>(AzureB2cService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
