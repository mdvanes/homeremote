import { Logger, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Socket, Server } from "socket.io";

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({
    // TODO fix proxy
    cors: {
        origin: "*",
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger: Logger;
    // @WebSocketServer()
    // server: Server;
    private activeConnections: string[];

    constructor() {
        this.logger = new Logger(EventsGateway.name);
        this.activeConnections = [];
    }

    // @UseGuards(JwtAuthGuard)
    @SubscribeMessage("events")
    findAll(
        @MessageBody() data: any,
        @ConnectedSocket() client: any // TODO type should be Socket, but which one?
    ): Observable<WsResponse<number>> {
        // TODO fix logged path and add user name (who)
        this.logger.verbose(`Subscribe to /ws/events`);
        // TODO authentication socket.request.headers.cookie should contain the token
        // this.logger.verbose(client.request.headers.cookie);
        // this.logger.verbose(JSON.stringify(client, null, 2));
        return from([1, 2, 3]).pipe(
            map((item) => ({ event: "events", data: item }))
        );
    }

    // @SubscribeMessage("events")
    // findAll(@Request() req: AuthenticatedRequest, @MessageBody() data: any): Observable<WsResponse<number>> {
    //     this.logger.verbose(`Subscribe to /?/events`);
    //     return from([1, 2, 3]).pipe(
    //         map((item) => ({ event: "events", data: item }))
    //     );
    // }

    @SubscribeMessage("identity")
    async identity(@MessageBody() data: number): Promise<number> {
        this.logger.verbose(`Subscribe to /ws/identity`);
        return data;
    }

    @SubscribeMessage("active")
    active(@MessageBody() data: number): Observable<WsResponse<string[]>> {
        this.logger.verbose(`Subscribe to /ws/active`);
        return from([this.activeConnections]).pipe(
            map((item) => ({ event: "events", data: item }))
        );
    }

    // TODO https://gabrieltanner.org/blog/nestjs-realtime-chat/
    handleConnection(client: WebSocket, ...args: any[]) {
        this.logger.verbose(`handleConnection`);
        this.logger.verbose(client.OPEN);
        // this.logger.verbose(client.client);
        // this.logger.verbose(client.id);
        // this.logger.verbose(client.conn);
        // this.logger.verbose(JSON.stringify(args[0].id));
        // TODO Client Id should be set! and is the way to differentiate between connections
        // this.activeConnections.push(`${client.id}`);
        this.activeConnections.push(`${Math.floor(Math.random() * 10000)}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.verbose(
            `handleDisconnect ${this.activeConnections.join(",")}`
        );
    }
}
