import { Logger, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server } from "socket.io";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({
    // cors: {
    //     origin: "*",
    // },
})
export class EventsGateway {
    private readonly logger: Logger;
    // @WebSocketServer()
    // server: Server;

    constructor() {
        this.logger = new Logger(EventsGateway.name);
    }

    @UseGuards(JwtAuthGuard)
    @SubscribeMessage("events")
    findAll(
        @MessageBody() data: any,
        @ConnectedSocket() client: any // TODO type should be Socket, but which one?
    ): Observable<WsResponse<number>> {
        // TODO fix logged path and add user name (who)
        this.logger.verbose(`Subscribe to /?/events`);
        // TODO authentication socket.request.headers.cookie should contain the token
        this.logger.verbose(client.request.headers.cookie);
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
        return data;
    }
}
