import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    categories: string[];
    imageUrl: string
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    categories: { type: Array<String>, required: false },
    imageUrl: { type: String, required: false },
});

export default mongoose.model<IProduct>('Product', ProductSchema);

