import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Number, unique: true })
  _id: number;

  @Prop({ required: true })
  user: number;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  amount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
