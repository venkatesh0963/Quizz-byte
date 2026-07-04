const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const email = 'admin@test.com';
    const password = 'password123';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    console.log('User found in DB. Hashed password:', user.password);

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

testLogin();
