import { Body, Controller, Get, HttpCode, HttpStatus, Post, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MessagingService } from "@modules/messaging/application/services/messaging.service";
import { PublishMessageDto } from "@modules/messaging/application/dto/publish-message.dto";
import { ConsumedMessageDto } from "@modules/messaging/application/dto/consumed-message.dto";
import { Public } from "@shared/infra/decorators/public.decorator";

const EXCHANGE_TYPE = "direct";

const EXCHANGES = {
  created: { exchange: "auth.created.exchange", routingKey: "user.created", queue: "auth.created.queue" },
  updated: { exchange: "auth.updated.exchange", routingKey: "user.updated", queue: "auth.updated.queue" },
  deleted: { exchange: "auth.deleted.exchange", routingKey: "user.deleted", queue: "auth.deleted.queue" },
} as const;

type EventType = keyof typeof EXCHANGES;

@ApiTags("messaging")
@Controller("messaging")
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("exchange/setup")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar todas as exchanges do auth" })
  async createExchanges(): Promise<void> {
    for (const { exchange } of Object.values(EXCHANGES)) {
      await this.messagingService.createExchange(exchange, EXCHANGE_TYPE);
    }
  }

  @Post("queue/setup")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Criar todas as filas e bindings do auth" })
  async createQueues(): Promise<void> {
    for (const { queue, exchange, routingKey } of Object.values(EXCHANGES)) {
      await this.messagingService.createQueue(queue, exchange, routingKey);
    }
  }

  @Post("publish/:event")
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Publicar mensagem (event: created | updated | deleted)" })
  async publish(@Param("event") event: EventType, @Body() body: PublishMessageDto): Promise<void> {
    const { exchange, routingKey } = EXCHANGES[event];
    return this.messagingService.publish(body, exchange, routingKey);
  }

  @Get("consume/:event")
  @Public()
  @ApiOperation({ summary: "Consumir mensagem (event: created | updated | deleted)" })
  async consume(@Param("event") event: EventType): Promise<ConsumedMessageDto> {
    const { queue } = EXCHANGES[event];
    return this.messagingService.consume(queue);
  }
}