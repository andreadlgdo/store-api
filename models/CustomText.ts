import mongoose, { Schema, Document } from 'mongoose';

interface ICustomText extends Document {
    page: string;
    texts: object;
}

const CustomTextSchema: Schema = new Schema({
    page: { type: String, required: true },
    texts: { type: Object, required: true }
}, { collection: 'customTexts' });

export default mongoose.model<ICustomText>('CustomText', CustomTextSchema);

