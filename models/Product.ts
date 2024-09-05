import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    isFavourite: boolean;
}

const ProductSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    isFavourite: { type: Boolean, required: false }
});

export default mongoose.model<IProduct>('Product', ProductSchema);

