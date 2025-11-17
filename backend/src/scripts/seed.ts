import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '@/config/database';
import { User, Product, Order, Cart, Wishlist } from '@/models';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

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
    const products = await Product.create([
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
        price: 199.99,
        category: 'Electronics',
        brand: 'TechBrand',
        stock: 50,
        images: [
          'https://example.com/headphones1.jpg',
          'https://example.com/headphones2.jpg',
        ],
        tags: ['audio', 'wireless', 'noise-cancelling', 'bluetooth'],
        isActive: true,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking, GPS, and smartphone integration.',
        price: 299.99,
        category: 'Electronics',
        brand: 'SmartTech',
        stock: 30,
        images: [
          'https://example.com/watch1.jpg',
          'https://example.com/watch2.jpg',
        ],
        tags: ['wearable', 'fitness', 'smartwatch', 'gps', 'health'],
        isActive: true,
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable and durable running shoes with advanced cushioning technology.',
        price: 129.99,
        category: 'Sports',
        brand: 'SportMax',
        stock: 75,
        images: [
          'https://example.com/shoes1.jpg',
          'https://example.com/shoes2.jpg',
        ],
        tags: ['footwear', 'running', 'sports', 'athletic'],
        isActive: true,
      },
      {
        name: 'Laptop Backpack',
        description: 'Spacious and durable backpack with laptop compartment and multiple pockets.',
        price: 49.99,
        category: 'Accessories',
        brand: 'TravelPro',
        stock: 100,
        images: [
          'https://example.com/backpack1.jpg',
          'https://example.com/backpack2.jpg',
        ],
        tags: ['bag', 'laptop', 'travel', 'backpack'],
        isActive: true,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality and waterproof design.',
        price: 79.99,
        category: 'Electronics',
        brand: 'SoundWave',
        stock: 60,
        images: [
          'https://example.com/speaker1.jpg',
          'https://example.com/speaker2.jpg',
        ],
        tags: ['audio', 'bluetooth', 'wireless', 'portable', 'waterproof'],
        isActive: true,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with extra cushioning for comfortable practice.',
        price: 34.99,
        category: 'Sports',
        brand: 'FitGear',
        stock: 40,
        images: [
          'https://example.com/yogamat1.jpg',
          'https://example.com/yogamat2.jpg',
        ],
        tags: ['yoga', 'fitness', 'exercise', 'mat'],
        isActive: true,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with programmable features and thermal carafe.',
        price: 89.99,
        category: 'Home',
        brand: 'BrewMaster',
        stock: 25,
        images: [
          'https://example.com/coffee1.jpg',
          'https://example.com/coffee2.jpg',
        ],
        tags: ['kitchen', 'coffee', 'appliance', 'brewing'],
        isActive: true,
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and color temperature.',
        price: 39.99,
        category: 'Home',
        brand: 'LightPro',
        stock: 45,
        images: [
          'https://example.com/lamp1.jpg',
          'https://example.com/lamp2.jpg',
        ],
        tags: ['lighting', 'led', 'desk', 'home-office'],
        isActive: true,
      },
    ]);

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