import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "@modules/messaging/infra/rabbitmq/rabbitmq.service";

const EXCHANGES = {
  created: { exchange: "auth.created.exchange", routingKey: "user.created" },
  updated: { exchange: "auth.updated.exchange", routingKey: "user.updated" },
  deleted: { exchange: "auth.deleted.exchange", routingKey: "user.deleted" },
} as const;

type EventType = keyof typeof EXCHANGES;

@Injectable()
export class MessagingPublisherService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publish(event: EventType, data: object): Promise<void> {
    const { exchange, routingKey } = EXCHANGES[event];
    const channel = this.rabbitMQService.getChannel();
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
  }
}