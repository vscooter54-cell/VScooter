require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@vscooter.ch',
  password: 'admin123', // Will be hashed by the model
  role: 'admin',
  isEmailVerified: true,
};

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('   Email:', adminUser.email);
      console.log('   Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = new User(adminUser);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('   Login Credentials:');
    console.log('   -------------------');
    console.log('   Email:', adminUser.email);
    console.log('   Password:', adminUser.password);
    console.log('   Role:', adminUser.role);
    console.log('');
    console.log('   Admin Portal: http://localhost:5175/admin/login');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
