import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RoomUser {
  socketId: string;
  userId: string;
}
/**
 * Fully featured abstract WebSocket gateway for NestJS,
 * implementing all common `socket.io` emit styles.
 */
@WebSocketGateway({
  cors: { origin: '*' },
})
export abstract class SocketBaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  public rooms = new Map<string, RoomUser[]>();

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.response('connection.success', { socketId: client.id });
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    this.response('connection.disconnected', { socketId: client.id });
    for (const [roomId, users] of this.rooms.entries()) {
      const index = users.findIndex((u) => u.socketId === client.id);
      if (index !== -1) {
        const [user] = users.splice(index, 1);
        this.rooms.set(roomId, users);
        client.broadcast.to(roomId).emit('user-left', { socketId: client.id, userId: user.userId });
      }
    }
  }

  @SubscribeMessage('room.join')
  handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    const { roomId } = data;

    client.join(roomId);

    this.toRoomExceptSender(client, roomId, 'room.user.joined', {
      senderId: client.id,
    });
  }

  @SubscribeMessage('room.leave')
  handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    const { roomId } = data;

    const roomUsers = this.rooms.get(roomId);
    if (!roomUsers) return;

    const index = roomUsers.findIndex((u) => u.socketId === client.id);
    if (index !== -1) {
      const [user] = roomUsers.splice(index, 1);
      this.rooms.set(roomId, roomUsers);
      client.leave(roomId);
      client.to(roomId).emit('room.user.left', { socketId: client.id, userId: user.userId });
    }
  }

  @SubscribeMessage('room.send')
  sendToRoom(
    @MessageBody() data: { roomId: string; data: any },
    @ConnectedSocket() client: Socket
  ) {
    const { roomId, data: message } = data;
    this.toRoom(roomId, 'room.message', {
      senderId: client.id,
      message: {
        ...message,
        senderId: client.id,
      },
    });
  }

  public sendToAllClients(event: string, data: any) {
    this.server.emit(event, data);
  }

  public response(event: string, data: any) {
    this.server.emit(event, data);
  }

  public sendToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
  }

  // Basic emit to the current socket
  public emitToClient(client: Socket, event: string, payload: any): void {
    client.emit(event, payload);
  }

  // To all clients in current namespace except sender
  public broadcastExceptSender(client: Socket, event: string, payload: any): void {
    client.broadcast.emit(event, payload);
  }

  // (1 -> n) broadcast all
  public broadcastToAll(event: string, payload: any): void {
    this.server.emit(event, payload);
  }

  // To all clients in one room except sender
  public toRoomExceptSender(client: Socket, room: string, event: string, payload: any): void {
    client.to(room).emit(event, payload);
  }

  // To multiple rooms except sender
  public toMultipleRoomsExceptSender(
    client: Socket,
    rooms: string[],
    event: string,
    payload: any
  ): void {
    const broadcaster = client;
    for (const room of rooms) {
      broadcaster.to(room);
    }
    broadcaster.emit(event, payload);
  }

  // To all clients in a room
  public toRoom(room: string, event: string, payload: any): void {
    this.server.in(room).emit(event, payload);
  }

  // To all clients in a namespace
  public toNamespace(namespace: string, event: string, payload: any): void {
    this.server.of(namespace).emit(event, payload);
  }

  // To a room in a namespace
  public toRoomInNamespace(namespace: string, room: string, event: string, payload: any): void {
    this.server.of(namespace).to(room).emit(event, payload);
  }

  // To a specific socket ID
  public toSocketId(socketId: string, event: string, payload: any): void {
    this.server.to(socketId).emit(event, payload);
  }

  // To all clients on this node (multi-node support)
  public toLocal(event: string, payload: any): void {
    this.server.local.emit(event, payload);
  }

  // To all connected clients
  public toAll(event: string, payload: any): void {
    this.server.emit(event, payload);
  }

  // With acknowledgement
  public emitWithAck<T = any>(client: Socket, event: string, payload: any): Promise<T> {
    return new Promise((resolve) => {
      client.emit(event, payload, (response: T) => {
        resolve(response);
      });
    });
  }

  // Emit without compression
  public emitUncompressed(client: Socket, event: string, payload: any): void {
    client.compress(false).emit(event, payload);
  }

  // Volatile emit (may be dropped if transport is not writable)
  public emitVolatile(client: Socket, event: string, payload: any): void {
    client.volatile.emit(event, payload);
  }

  /**
   * WARNING: `socket.to(socket.id).emit()` will NOT work as expected.
   * To message only the sender, always use socket.emit() instead.
   */
}
