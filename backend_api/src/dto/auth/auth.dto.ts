import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  fullName: string

  @IsOptional()
  profilePicture?: string
}

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class RefreshToken {
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}

export class SignoutDto {
  @IsNotEmpty()
  @IsString()
  userId: string
}
