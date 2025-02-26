import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    type: string;
    impageUrl: string;
    addresses?: string[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: false },
    addresses: { type: Array<String>, required: false }
});

export default mongoose.model<IUser>('User', UserSchema);

