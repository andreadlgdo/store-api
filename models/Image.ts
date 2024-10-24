import mongoose, { Schema, Document } from 'mongoose';

interface IImage extends Document {
    type: string;
    impageUrl: string;
}

const ImageSchema: Schema = new Schema({
    type: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

export default mongoose.model<IImage>('Image', ImageSchema);
