import { Test, TestingModule } from '@nestjs/testing';
import { MsGraphProvider } from './ms-graph-provider';

describe('MsGraphProvider', () => {
  let provider: MsGraphProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsGraphProvider],
    }).compile();

    provider = module.get<MsGraphProvider>(MsGraphProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
