import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    isFavorite: boolean;
    imageUrl: string
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    isFavorite: { type: Boolean, required: false },
    imageUrl: { type: String, required: false },
});

export default mongoose.model<IProduct>('Product', ProductSchema);

