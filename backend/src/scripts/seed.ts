import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '@/config/database';
import { User, Product, Order, Cart, Wishlist } from '@/models';
import { productSeedData } from '@/seeds/products.seed';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Connect to database
    await connectDB();
    console.log('Database connected successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular users
    console.log('Creating regular users...');
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
    ]);

    // Create products
    console.log('Creating products...');
    const products = await Product.create(productSeedData);

    // Create sample orders
    console.log('Creating sample orders...');
    await Order.create([
      {
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
          {
            product: products[2]._id,
            quantity: 2,
            price: products[2].price,
          },
        ],
        totalAmount: products[0].price + (products[2].price * 2),
        status: 'delivered',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paymentMethod: 'Credit Card',
        isPaid: true,
        paidAt: new Date(),
      },
      {
        user: users[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price,
          },
        ],
        totalAmount: products[1].price,
        status: 'shipped',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        isPaid: true,
        paidAt: new Date(),
      },
    ]);

    // Create carts
    console.log('Creating carts...');
    await Cart.create([
      {
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
          },
          {
            product: products[2]._id,
            quantity: 2,
          },
        ],
      },
      {
        user: users[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
          },
        ],
      },
    ]);

    // Create wishlists
    console.log('Creating wishlists...');
    await Wishlist.create([
      {
        user: users[0]._id,
        items: [
          { product: products[3]._id },
          { product: products[4]._id },
          { product: products[6]._id },
        ],
      },
      {
        user: users[1]._id,
        items: [
          { product: products[5]._id },
          { product: products[7]._id },
        ],
      },
    ]);

    console.log('Database seeding completed successfully!');
    console.log('\nCreated users:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log(`\nCreated ${products.length} products`);
    console.log('Created 2 sample orders');
    console.log('Created 2 carts');
    console.log('Created 2 wishlists');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await disconnectDB();
  }
};

// Run the seeding function
seedData();