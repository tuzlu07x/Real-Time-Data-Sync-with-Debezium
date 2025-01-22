import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async handleOrderMessage(message: any): Promise<void> {
    try {
      this.logger.debug('Processing order message:', JSON.stringify(message));

      if (!message?.payload?.after) {
        this.logger.warn('Invalid message format');
        return;
      }

      const { after, op } = message.payload;
      this.logger.log(`Processing ${op} operation for order ${after.id}`);

      let order = await this.orderModel.findOne({ _id: after.id });

      if (!order && (op === 'c' || op === 'u')) {
        order = new this.orderModel({
          _id: after.id,
          productName: after.productName,
          amount: after.amount,
          user: after.userId,
          createdAt: new Date(after.createdAt / 1000000),
        });
      } else if (order && op === 'u') {
        order.productName = after.productName;
        order.amount = after.amount;
        order.user = after.userId;
      }

      if (order) {
        await order.save();
        this.logger.log(
          `Successfully ${op === 'c' ? 'created' : 'updated'} order: ${order._id}`,
        );
      }
    } catch (error) {
      this.logger.error('Error processing order:', error);
      throw error;
    }
  }

  async findAll() {
    return this.orderModel.find().exec();
  }

  async findOne(id: number) {
    return this.orderModel.findOne({ _id: id }).exec();
  }
}
