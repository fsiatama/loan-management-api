import { Test, TestingModule } from '@nestjs/testing';
import { AzureB2cController } from './azure-b2c.controller';
import { AzureB2cService } from './azure-b2c.service';

describe('AzureB2cController', () => {
  let controller: AzureB2cController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AzureB2cController],
      providers: [AzureB2cService],
    }).compile();

    controller = module.get<AzureB2cController>(AzureB2cController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
