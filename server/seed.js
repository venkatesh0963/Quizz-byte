const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users to avoid duplicates in testing
    // await User.deleteMany();

    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('Admin user created');
    }

    const studentExists = await User.findOne({ email: 'student@test.com' });
    if (!studentExists) {
      await User.create({
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
      });
      console.log('Student user created');
    }

    console.log('Data seeding complete!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
