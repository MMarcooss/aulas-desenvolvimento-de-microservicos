import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { RabbitMQService } from "@modules/messaging/infra/rabbitmq/rabbitmq.service";
import type { Channel } from "amqplib";

const EXCHANGES = [
  { exchange: "auth.created.exchange", routingKey: "user.created", queue: "auth.created.queue" },
  { exchange: "auth.updated.exchange", routingKey: "user.updated", queue: "auth.updated.queue" },
  { exchange: "auth.deleted.exchange", routingKey: "user.deleted", queue: "auth.deleted.queue" },
];

@Injectable()
export class MessagingConsumerService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(MessagingConsumerService.name);
  private channel!: Channel;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onApplicationBootstrap(): Promise<void> {
    this.channel = await this.rabbitMQService.createChannel();

    for (const { exchange, routingKey, queue } of EXCHANGES) {
      await this.channel.assertExchange(exchange, "direct", { durable: true });
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, exchange, routingKey);

      await this.channel.consume(queue, (msg) => {
        if (!msg) return;
        const content = msg.content.toString();
        this.logger.log(`Mensagem recebida de "${queue}": ${content}`);
        this.channel.ack(msg);
      });

      this.logger.log(`Consumer registrado na fila "${queue}"`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
  }
}