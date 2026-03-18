import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BroadcastMessageRequestDto } from './dto/request/broadcast-message.request.dto';
import { SocketGateway } from './socket.gateway';

@ApiTags('socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateway: SocketGateway) {}

  @ApiOperation({ summary: 'Socket info' })
  @ApiResponse({ status: 200, description: 'Socket info' })
  @Get('info')
  async getInfo(@Param() param: any, @Query() query: any) {
    await this.socketGateway.sendToAllClients('pong', new Date().toISOString());
    return {
      hello: 'socket',
    };
  }

  @ApiOperation({ summary: 'hello' })
  @ApiResponse({ status: 200, description: 'hello' })
  @Get('hello')
  async getHello(@Param() param: any, @Query() query: any) {
    // handle hello
  }

  @ApiOperation({ summary: 'Send direct MessageBody' })
  @ApiResponse({ status: 201, description: 'Success response description' })
  @Post('/send/:id')
  async sendDirectMessage(@Body() body: any, @Param() param: any) {
    console.log({
      body,
      param,
    });
    this.socketGateway.sendToClient(param.id, 'inbox', body.message);
  }

  @Post('/broadcast')
  async broadcastMessage(@Body() body: BroadcastMessageRequestDto) {
    const { event, message } = body;

    this.socketGateway.broadcastToAll(event, message);
  }
}
