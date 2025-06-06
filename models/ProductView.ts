import mongoose, { Schema, Document } from 'mongoose';

interface IProductView extends Document {
    userId: string;
    productId: string;
    timestamp: Date;
}

const ProductViewSchema: Schema = new Schema({
    userId: { type: String, ref: 'User', required: true },
    productId: { type: String, ref: 'Product', required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IProductView>('ProductView', ProductViewSchema);