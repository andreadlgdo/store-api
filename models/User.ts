import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    type: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);

