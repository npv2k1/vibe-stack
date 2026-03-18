import { ApiProperty } from '@nestjs/swagger';

export class EncryptDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  key: string;
}

export class DecryptDto {
  ciphertext: string;
  key: string;
}

export class SignDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  key: string;
}

export class VerifySignatureDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  key: string;
}
