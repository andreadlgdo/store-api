import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    priceWithDiscount: number;
    categories: string[];
    quantity: number;
    imageUrl: string;
    onSale: boolean;
    isFavouriteUsersIds: string[];
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    priceWithDiscount: { type: Number, required: false },
    quantity: { type: Number, required: false },
    categories: { type: Array<String>, required: false },
    imageUrl: { type: String, required: false },
    onSale: { type: Boolean, required: false },
    isFavouriteUsersIds: { type: Array<String>, required: false },
});

export default mongoose.model<IProduct>('Product', ProductSchema);

