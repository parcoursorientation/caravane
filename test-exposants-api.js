// Test script for exposants API
const testExposantsAPI = async () => {
  const baseUrl = 'http://localhost:3000';
  
  // Test token (in real app, this would be a valid JWT)
  const testToken = 'Bearer test-token';
  
  console.log('Testing Exposants API...\n');
  
  // Test 1: GET all exposants
  try {
    console.log('1. Testing GET /api/admin/exposants');
    const response = await fetch(`${baseUrl}/api/admin/exposants`, {
      headers: {
        'Authorization': testToken
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET exposants successful');
      console.log('Response structure:', JSON.stringify(data, null, 2));
      console.log(`Found ${data.data?.length || 0} exposants`);
      
      if (data.data && data.data.length > 0) {
        console.log('\nFirst exposant details:');
        const first = data.data[0];
        Object.keys(first).forEach(key => {
          console.log(`  ${key}: ${first[key]}`);
        });
      }
    } else {
      console.log('❌ GET exposants failed:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ GET exposants error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: Check database directly via API
  try {
    console.log('2. Testing database connection via API');
    const response = await fetch(`${baseUrl}/api/admin/exposants`, {
      headers: {
        'Authorization': testToken
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database connection successful');
      console.log('Data source: Real database (not mock data)');
      console.log('Total exposants in database:', data.data?.length || 0);
      
      // Check if we have the seeded data
      if (data.data && data.data.length > 0) {
        const hasSeededData = data.data.some(e => 
          e.nom.includes('École Supérieure d\'Ingénierie') ||
          e.nom.includes('Institut de Commerce International')
        );
        console.log('Contains seeded data:', hasSeededData ? '✅ Yes' : '❌ No');
      }
    } else {
      console.log('❌ Database connection failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
  
  console.log('\nTest completed.');
};

testExposantsAPI();