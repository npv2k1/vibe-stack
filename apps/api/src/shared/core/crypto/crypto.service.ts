import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';
@Injectable()
export class CryptoService {
  encrypt(text: string, key: string): string {
    return crypto.AES.encrypt(text, key).toString();
  }

  decrypt(ciphertext: string, key: string): string {
    const bytes = crypto.AES.decrypt(ciphertext, key);
    return bytes.toString(crypto.enc.Utf8);
  }

  hash(text: string): string {
    return crypto.SHA256(text).toString();
  }
  generateRandomKey(length: number = 32): string {
    return crypto.lib.WordArray.random(length).toString();
  }

  sign(data: string, key: string): string {
    return crypto.HmacSHA256(data, key).toString();
  }

  async verifySignature(data: string, signature: string, key: string): Promise<boolean> {
    const expectedSignature = this.sign(data, key);
    return expectedSignature === signature;
  }
}
