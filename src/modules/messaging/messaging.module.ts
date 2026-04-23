import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitMQService } from "./infra/rabbitmq/rabbitmq.service";
import { MessagingPublisherService } from "./application/services/messaging-publisher.service";
import { MessagingConsumerService } from "./infra/consumers/messaging-consumer.service";

@Module({
  imports: [ConfigModule],
  providers: [RabbitMQService, MessagingPublisherService, MessagingConsumerService],
  exports: [MessagingPublisherService],
})
export class MessagingModule {}