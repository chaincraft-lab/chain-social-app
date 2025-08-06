import { Controller, Put, Body, Param, UseGuards, Query, HttpException, HttpStatus, ValidationPipe, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {

  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user details' })
  @Get('details')
  async getUserDetails(@Query('uuid') userId: string) {
    try {
      const userDetails = await this.usersService.getUserDetails(userId);
      return {
        message: 'User details retrieved successfully',
        status: HttpStatus.OK,
        data: userDetails
      };
    } catch (error) {
      throw new HttpException('Failed to retrieve user details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user details' })
  @Put('details')
  async updateUserDetails(
    @Query('uuid') uuid: string,
    @Body(ValidationPipe) updateUserDetailsDto: UpdateUserDetailsDto
  ) {
    try {
      await this.usersService.updateUserDetails(uuid, updateUserDetailsDto);
      return {
        message: 'User details updated successfully',
        status: HttpStatus.OK
      }

    } catch (error) {
      throw new HttpException(`User details update failed`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
