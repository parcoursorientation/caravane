// Test script for lycee API
const testLyceeAPI = async () => {
  const baseUrl = 'http://localhost:3000';
  
  // Test token (in real app, this would be a valid JWT)
  const testToken = 'Bearer test-token';
  
  console.log('Testing Lycee API...\n');
  
  // Test 1: GET all lycees
  try {
    console.log('1. Testing GET /api/admin/lycees');
    const response = await fetch(`${baseUrl}/api/admin/lycees`, {
      headers: {
        'Authorization': testToken
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET lycees successful');
      console.log(`Found ${data.data.length} lycees`);
      console.log('First lycee:', data.data[0]?.nom || 'None');
    } else {
      console.log('❌ GET lycees failed:', response.status);
    }
  } catch (error) {
    console.log('❌ GET lycees error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: PUT update a lycee (if we have lycees)
  try {
    console.log('2. Testing PUT /api/admin/lycees/1');
    const updateData = {
      nom: "Lycée Test Mis à Jour",
      adresse: "Adresse modifiée",
      type: "PUBLIC",
      description: "Description modifiée pour test",
      logo: ""
    };
    
    const response = await fetch(`${baseUrl}/api/admin/lycees/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': testToken
      },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ PUT lycee successful');
      console.log('Updated lycee:', data.data.nom);
    } else {
      const errorData = await response.json();
      console.log('❌ PUT lycee failed:', response.status, errorData.error);
    }
  } catch (error) {
    console.log('❌ PUT lycee error:', error.message);
  }
  
  console.log('\nTest completed.');
};

testLyceeAPI();