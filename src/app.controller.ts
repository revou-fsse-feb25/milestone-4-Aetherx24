import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'RevoBank API is running!' },
        timestamp: { type: 'string', format: 'date-time' },
        status: { type: 'string', example: 'ok' },
      },
    },
  })
  getHello(): object {
    return {
      message: 'RevoBank API is running!',
      timestamp: new Date().toISOString(),
      status: 'ok',
    };
  }
}
