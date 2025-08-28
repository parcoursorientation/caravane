// Test script for real lycee API with database
const testLyceeAPI = async () => {
  const baseUrl = 'http://localhost:3000';
  
  // Test token (in real app, this would be a valid JWT)
  const testToken = 'Bearer test-token';
  
  console.log('Testing Real Lycee API with Database...\n');
  
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
      console.log('First lycee ID:', data.data[0]?.id || 'None');
    } else {
      console.log('❌ GET lycees failed:', response.status);
    }
  } catch (error) {
    console.log('❌ GET lycees error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: PUT update a lycee (using the first lycee from the list)
  try {
    // First get the lycees to get a real ID
    const getResponse = await fetch(`${baseUrl}/api/admin/lycees`, {
      headers: {
        'Authorization': testToken
      }
    });
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      const firstLycee = getData.data[0];
      
      if (firstLycee) {
        console.log('2. Testing PUT /api/admin/lycees/' + firstLycee.id);
        const updateData = {
          nom: firstLycee.nom + " (Modifié)",
          adresse: firstLycee.adresse + " - Mise à jour",
          type: firstLycee.type,
          description: "Description modifiée via test API - " + new Date().toLocaleString(),
          logo: ""
        };
        
        const response = await fetch(`${baseUrl}/api/admin/lycees/${firstLycee.id}`, {
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
          console.log('Updated description:', data.data.description);
        } else {
          const errorData = await response.json();
          console.log('❌ PUT lycee failed:', response.status, errorData.error);
        }
      } else {
        console.log('❌ No lycees found to update');
      }
    } else {
      console.log('❌ Could not get lycees list for update test');
    }
  } catch (error) {
    console.log('❌ PUT lycee error:', error.message);
  }
  
  console.log('\n');
  
  // Test 3: Verify the update by getting the lycee again
  try {
    console.log('3. Verifying update by GET /api/admin/lycees');
    const response = await fetch(`${baseUrl}/api/admin/lycees`, {
      headers: {
        'Authorization': testToken
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET lycees successful');
      console.log(`Found ${data.data.length} lycees`);
      const firstLycee = data.data[0];
      if (firstLycee) {
        console.log('First lycee name:', firstLycee.nom);
        console.log('First lycee description:', firstLycee.description);
        
        // Check if it was updated
        if (firstLycee.nom.includes('Modifié')) {
          console.log('✅ Update verified - lycee was modified in database');
        } else {
          console.log('❌ Update not verified - lycee was not modified');
        }
      }
    } else {
      console.log('❌ GET lycees failed:', response.status);
    }
  } catch (error) {
    console.log('❌ GET lycees error:', error.message);
  }
  
  console.log('\nTest completed.');
};

testLyceeAPI();