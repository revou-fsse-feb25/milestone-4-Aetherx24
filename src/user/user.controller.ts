import { Controller, Get, Patch, Body, Request, UseGuards, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BulkUpdateRolesDto } from './dto/bulk-update-roles.dto';
import { UserIdDto } from './dto/user-id.dto';

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', example: 'USER' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Name' },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Updated Name' },
        role: { type: 'string', example: 'USER' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateUserProfile(req.user.userId, updateProfileDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserStats(@Request() req) {
    return this.userService.getUserStats(req.user.userId);
  }

  // Admin-only endpoints
  @Get('admin/all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('admin/search')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Search users (Admin only)' })
  @ApiQuery({ name: 'q', description: 'Search query for name or email' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async searchUsers(@Query('q') query: string) {
    return this.userService.searchUsers(query);
  }

  @Get('admin/role/:role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get users by role (Admin only)' })
  @ApiParam({ name: 'role', description: 'User role (USER or ADMIN)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUsersByRole(@Param('role') role: string) {
    return this.userService.getUsersByRole(role);
  }

  @Get('admin/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get specific user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param() params: UserIdDto) {
    const userId = parseInt(params.id, 10);
    return this.userService.getUserById(userId);
  }

  @Get('admin/:id/activity')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get user activity summary (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User activity retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserActivitySummary(@Param() params: UserIdDto) {
    const userId = parseInt(params.id, 10);
    return this.userService.getUserActivitySummary(userId);
  }

  @Patch('admin/:id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'ADMIN' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserRole(@Param() params: UserIdDto, @Body() updateRoleDto: UpdateRoleDto) {
    const userId = parseInt(params.id, 10);
    return this.userService.updateUserRole(userId, updateRoleDto.role);
  }

  @Patch('admin/bulk-role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Bulk update user roles (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'number' },
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User roles updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async bulkUpdateUserRoles(@Body() bulkUpdateRolesDto: BulkUpdateRolesDto) {
    return this.userService.bulkUpdateUserRoles(bulkUpdateRolesDto.updates);
  }

  @Delete('admin/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param() params: UserIdDto) {
    const userId = parseInt(params.id, 10);
    return this.userService.deleteUser(userId);
  }
}