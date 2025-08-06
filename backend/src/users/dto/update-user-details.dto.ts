import { IsNumber, Min, Max, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Address, UserDetails } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class PhysicalInfoDto {
    @ApiProperty({ description: 'User height in centimeters', example: 180 })
    @IsNumber()
    height: number;

    @ApiProperty({ description: 'User weight in kilograms', example: 75 })
    @IsNumber()
    weight: number;
}

class AddressDto {
    @ApiProperty({ description: 'Country name', example: 'Turkey' })
    @IsString()
    country: string;

    @ApiProperty({ description: 'City name', example: 'Istanbul' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'Street name', example: 'Street' })
    @IsString()
    street: string;

    @ApiProperty({ description: 'State name', example: 'State' })
    @IsString()
    state: string;

    @ApiProperty({ description: 'Postal code', example: '34000' })
    @IsString()
    postalCode: string;
}

class UserDetailsDto {
    @ApiProperty({ description: 'User age', minimum: 0, maximum: 120, example: 30 })
    @IsNumber()
    @Min(0)
    @Max(120)
    age: number;

    @ApiProperty({ type: PhysicalInfoDto, description: 'User physical information' })
    @IsObject()
    @ValidateNested()
    @Type(() => PhysicalInfoDto)
    physicalInfo: PhysicalInfoDto;

    @ApiProperty({ description: 'About user', example: 'I love coding and learning new technologies.' })
    @IsString()
    about: string;
}

export class UpdateUserDetailsDto {
    @ApiProperty({ type: UserDetailsDto, description: 'User details' })
    @ValidateNested()
    @Type(() => UserDetailsDto)
    userDetails: UserDetails;

    @ApiProperty({ type: AddressDto, description: 'User address' })
    @ValidateNested()
    @IsObject()
    @Type(() => AddressDto)
    address: Address;
}