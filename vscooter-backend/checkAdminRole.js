require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({ email: 'admin@vscooter.ch' }).select('+password');

    console.log('Admin User Details:');
    console.log('==================');
    console.log('Email:', admin.email);
    console.log('FirstName:', admin.firstName);
    console.log('LastName:', admin.lastName);
    console.log('Role:', admin.role);
    console.log('isActive:', admin.isActive);
    console.log('emailVerified:', admin.emailVerified);
    console.log('Password hash exists:', !!admin.password);
    console.log('Password hash length:', admin.password?.length);

    // Check all possible role values in schema
    console.log('\n--- Testing password comparison ---');
    const testPassword = 'Admin123!';
    const isMatch = await admin.comparePassword(testPassword);
    console.log('Password "Admin123!" matches:', isMatch);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdmin();
