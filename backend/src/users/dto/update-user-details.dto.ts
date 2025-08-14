import { PartialType } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './update-user-profile.dto';

export class UpdateUserDetailsDto extends PartialType(UpdateUserProfileDto) {}