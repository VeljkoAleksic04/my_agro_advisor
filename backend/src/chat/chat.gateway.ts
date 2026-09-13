import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ObavestenjeService } from '../obavestenje/obavestenje.service';

interface AutentifikovaniSocket extends Socket {
  korisnikId?: number;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:4200'] },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly obavestenjeService: ObavestenjeService,
  ) {}

  handleConnection(socket: AutentifikovaniSocket) {
    try {
      const token = this.tokenIzSocketa(socket);
      const payload = this.jwtService.verify<{ sub: number }>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });
      if (!payload?.sub) throw new Error('Neispravan token');

      socket.korisnikId = payload.sub;
      socket.join(this.sobaKorisnika(payload.sub));
      socket.emit('chat:ready');
    } catch {
      socket.emit('chat:error', { message: 'Neautorizovana chat veza.' });
      socket.disconnect(true);
    }
  }

  handleDisconnect(_socket: AutentifikovaniSocket) {}

  @SubscribeMessage('chat:send')
  async posalji(
    @ConnectedSocket() socket: AutentifikovaniSocket,
    @MessageBody() telo: { primalacId: number; sadrzaj: string },
  ) {
    if (!socket.korisnikId) return;
    const poruka = await this.chatService.posalji(socket.korisnikId, Number(telo.primalacId), String(telo.sadrzaj ?? ''));
    this.server.to(this.sobaKorisnika(socket.korisnikId)).emit('chat:message', poruka);
    this.server.to(this.sobaKorisnika(poruka.primalacId)).emit('chat:message', poruka);
    await this.obavestenjeService.kreiraj({ korisnikId: poruka.primalacId, tip: 'CHAT', poruka: 'Nova privatna poruka.', });
    this.server.to(this.sobaKorisnika(poruka.primalacId)).emit('chat:unread', { broj: await this.chatService.brojNeprocitanih(poruka.primalacId) });
  }

  @SubscribeMessage('chat:typing')
  tipkanje(
    @ConnectedSocket() socket: AutentifikovaniSocket,
    @MessageBody() telo: { primalacId: number; aktivno: boolean },
  ) {
    if (!socket.korisnikId) return;
    this.server.to(this.sobaKorisnika(Number(telo.primalacId))).emit('chat:typing', {
      korisnikId: socket.korisnikId,
      aktivno: Boolean(telo.aktivno),
    });
  }

  private sobaKorisnika(id: number) {
    return `korisnik:${id}`;
  }

  private tokenIzSocketa(socket: Socket): string {
    const authToken = socket.handshake.auth?.['token'];
    if (typeof authToken === 'string' && authToken) return authToken;
    const header = socket.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) return header.slice(7);
    throw new Error('Token nije prosleđen.');
  }
}
