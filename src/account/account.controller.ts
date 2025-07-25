import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountService } from './account.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Request() req, @Body() body: { initialBalance: number }) {
    return this.accountService.createAccount(req.user.userId, body.initialBalance);
  }

  @Get()
  findAll(@Request() req) {
    return this.accountService.getAccounts(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.accountService.getAccountById(req.user.userId, Number(id));
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() body: { balance?: number }) {
    return this.accountService.updateAccount(req.user.userId, Number(id), body);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.accountService.deleteAccount(req.user.userId, Number(id));
  }
}