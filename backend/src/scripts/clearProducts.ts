import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '@/models';

// Load environment variables
dotenv.config();

const clearProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing products:', error);
    process.exit(1);
  }
};

clearProducts();
