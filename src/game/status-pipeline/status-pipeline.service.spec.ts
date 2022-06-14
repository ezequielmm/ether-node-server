import { Test, TestingModule } from '@nestjs/testing';
import { StatusPipelineService } from './status-pipeline.service';

describe('StatusPipelineService', () => {
  let service: StatusPipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusPipelineService],
    }).compile();

    service = module.get<StatusPipelineService>(StatusPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
