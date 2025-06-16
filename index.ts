import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || '3000';

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(err => console.error('MongoDB connection error:', err));
}
