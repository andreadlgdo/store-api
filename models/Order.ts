import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    userId: string;
    status: string;
    products: OrderProducts[];
}

interface OrderProducts  {
    units: string;
    size: string;
    productId: string;
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    products: { type: Array<OrderProducts>, required: true },
});

export default mongoose.model<IOrder>('Order', OrderSchema);

