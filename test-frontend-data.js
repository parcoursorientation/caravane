// Test script to check if frontend can get data
const testFrontendData = async () => {
  console.log('Testing frontend data access...\n');
  
  // Test 1: Check if localStorage has adminToken
  console.log('1. Checking localStorage for adminToken...');
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    console.log('Token found:', token ? '✅ Yes' : '❌ No');
    if (token) {
      console.log('Token value:', token.substring(0, 20) + '...');
    }
  } else {
    console.log('❌ Running in Node.js environment, no localStorage');
  }
  
  // Test 2: Try to fetch data without token
  console.log('\n2. Testing API without authentication...');
  try {
    const response = await fetch('http://localhost:3000/api/admin/exposants');
    console.log('Response status:', response.status);
    if (response.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      const data = await response.json();
      console.log('Unexpected response:', data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 3: Try to fetch data with fake token
  console.log('\n3. Testing API with fake token...');
  try {
    const response = await fetch('http://localhost:3000/api/admin/exposants', {
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    });
    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API accepts fake token');
      console.log('Data length:', data.data?.length || 0);
    } else {
      console.log('❌ API rejects fake token');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\nTest completed.');
};

testFrontendData();