import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EncryptDto } from './dto/crypto.dto';
import { CryptoService } from './crypto.service';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  // ENCRYPTION

  @Post('encrypt')
  async encrypt(@Body() body: EncryptDto) {
    return this.cryptoService.encrypt(JSON.stringify(body), 'secret-key');
  }

  @Post('decrypt')
  async decrypt(@Body() body: EncryptDto) {
    const decrypted = this.cryptoService.decrypt(body.data, 'secret-key');
    return JSON.parse(decrypted);
  }
}
