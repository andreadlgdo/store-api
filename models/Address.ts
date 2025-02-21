import mongoose, { Schema, Document } from 'mongoose';

interface IAddress extends Document {
    userId: string;
    street: string;
    number: string;
    letter: string;
    zipCode: string;
    city: string;
    country: string;
    label: string;
    isDefault: boolean;
}

const AddressSchema: Schema = new Schema({
    userId: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    letter: { type: String, required: true },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    label: { type: String, required: false },
    isDefault: { type: Boolean, required: true },
});

export default mongoose.model<IAddress>('Address', AddressSchema);

