import { IsOptional, IsString, IsUrl, Length, Matches } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Matches(/^[\p{L}'\s]{3,50}$/gui)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[\p{L}'\s]{3,50}$/gui)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Length(3, 200)
    bio?: string;

    @IsOptional()
    @IsString()
    @IsUrl({ require_protocol: true }, { message: 'Website must be a valid URL' })
    websiteLink?: string;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    @Matches(/^[\p{L}'\s_-]{3,50}$/gui)
    websiteName?: string;
}