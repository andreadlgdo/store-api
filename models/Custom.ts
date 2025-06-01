import mongoose, { Schema, Document } from 'mongoose';

interface ICustom extends Document {
    page: string;
    texts: object;
    data: object;
    visuals: object;
}

const CustomSchema: Schema = new Schema({
    page: { type: String, required: true },
    texts: { type: Object, required: false },
    data: { type: Object, required: false },
    visuals: { type: Object, required: false }
}, { collection: 'custom' });

export default mongoose.model<ICustom>('Custom', CustomSchema);

