import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    userId: string;
    user: UserOrder;
    address: AddressOrder;
    status: string;
    products: OrderProducts[];
    promotionCode: string;
    total: number;
    timestamp: Date;
}

interface OrderProducts  {
    units: string;
    size?: string;
    productId: string;
}

interface UserOrder  {
    name: string;
    surname: string;
    email: string;
}

interface AddressOrder {
    street: string;
    number: string;
    letter: string;
    zipCode: string;
    city: string;
    country: string;
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    user: { type: Object, required: false },
    address: { type: Object, required: false },
    status: { type: String, required: true },
    products: { type: Array<OrderProducts>, required: true },
    promotionCode: { type: String, required: false },
    total: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);

