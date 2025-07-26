import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

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

  @Get('db-test')
  @ApiOperation({ summary: 'Database connection test' })
  @ApiResponse({ status: 200, description: 'Database connected successfully' })
  @ApiResponse({ status: 500, description: 'Database connection failed' })
  async testDatabase() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        status: 'connected',
      };
    } catch (error) {
      return {
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        status: 'error',
      };
    }
  }
}
