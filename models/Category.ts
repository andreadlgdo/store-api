import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
    title: string;
    imageUrl: string;
}

const CategorySchema: Schema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

export default mongoose.model<ICategory>('Category', CategorySchema);

