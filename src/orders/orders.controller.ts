import { Controller, Get, Param, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('dbserver1.public.orders')
  async handleOrderMessage(@Payload() message: any) {
    this.logger.log('Received Kafka message for orders');
    await this.ordersService.handleOrderMessage(message);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
