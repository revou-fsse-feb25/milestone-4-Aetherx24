import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Bank Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() body: CreateAccountDto) {
    return this.accountService.createAccount(req.user.userId, body.initialBalance);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts (admin sees all, users see their own)' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.accountService.getAccounts(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific account by ID' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.accountService.getAccountById(req.user.userId, +id, req.user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account (admin can update any, users can update their own)' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  update(@Request() req, @Param('id') id: string, @Body() body: UpdateAccountDto) {
    return this.accountService.updateAccount(req.user.userId, +id, body, req.user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account (admin can delete any, users can delete their own)' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  remove(@Request() req, @Param('id') id: string) {
    return this.accountService.deleteAccount(req.user.userId, +id, req.user.role);
  }

  // Admin-only endpoints
  @Get('admin/all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all accounts with user details (Admin only)' })
  @ApiResponse({ status: 200, description: 'All accounts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  getAllAccountsForAdmin() {
    return this.accountService.getAllAccountsForAdmin();
  }

  @Post('admin/create-for-user')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create account for any user (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
        initialBalance: { type: 'number', example: 1000 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  createAccountForUser(@Body() body: { userId: number; initialBalance: number }) {
    return this.accountService.createAccountForUser(body.userId, body.initialBalance);
  }
}