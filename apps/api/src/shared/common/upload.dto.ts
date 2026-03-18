import { ApiProperty } from '@nestjs/swagger';

export class Buffer {
  @ApiProperty({ example: 'Buffer', description: 'Type identifier for buffer' })
  type: string;

  @ApiProperty({ type: [Number], description: 'Buffer data as an array of numbers' })
  data: number[];
}

export class File {
  @ApiProperty({ example: 'file', description: 'Form field name' })
  fieldname: string;

  @ApiProperty({ example: 'myfile.txt', description: 'Original file name' })
  originalname: string;

  @ApiProperty({ example: '7bit', description: 'File encoding' })
  encoding: string;

  @ApiProperty({ example: 'text/plain', description: 'MIME type' })
  mimetype: string;

  @ApiProperty({ type: ArrayBuffer, description: 'File buffer content' })
  buffer: ArrayBuffer;

  @ApiProperty({ example: 12345, description: 'File size in bytes' })
  size: number;
}

export class UploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  files: Array<Express.Multer.File>;
}
