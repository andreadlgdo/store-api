import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    title: string;
    imageUrl: string;
    parentId?: string
    relatedId?: string[]
}

const CategorySchema: Schema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    parentId: { type: String, required: false },
    relatedId: { type: Array<String>, required: false }
});

export default mongoose.model<ICategory>('Category', CategorySchema);

