const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with:');
    console.log('  Email: admin@vscooter.ch');
    console.log('  Password: Admin123!');
    console.log('\nSending request to: http://localhost:5000/api/users/login\n');

    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@vscooter.ch',
      password: 'Admin123!'
    });

    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('\nResponse:');
    console.log('  Status:', response.status);
    console.log('  Token:', response.data.token ? 'Received' : 'Not received');
    console.log('  User:', response.data.user);

  } catch (error) {
    console.log('❌ LOGIN FAILED!');
    console.log('\nError Details:');
    console.log('  Status:', error.response?.status);
    console.log('  Message:', error.response?.data?.message || error.message);
    console.log('  Full error:', error.response?.data);
  }
}

testLogin();
