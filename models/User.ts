import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    type: string;
}

const UserSchema: Schema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);

