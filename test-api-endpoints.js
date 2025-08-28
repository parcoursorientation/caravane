const fetch = require('node-fetch');

async function testAPIEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('=== TEST DES API ENDPOINTS ===\n');
  
  // Test 1: GET /api/admin/lycees
  try {
    console.log('🔄 Test: GET /api/admin/lycees');
    const response = await fetch(`${baseUrl}/api/admin/lycees`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Succès:');
      console.log(`   - Total lycées: ${data.total}`);
      console.log(`   - Structure: ${Object.keys(data).join(', ')}`);
      if (data.data && data.data.length > 0) {
        console.log('   - Premier lycée:', {
          id: data.data[0].id,
          nom: data.data[0].nom,
          type: data.data[0].type
        });
      }
    } else {
      console.log('❌ Échec:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: GET /api/admin/exposants
  try {
    console.log('🔄 Test: GET /api/admin/exposants');
    const response = await fetch(`${baseUrl}/api/admin/exposants`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Succès:');
      console.log(`   - Total exposants: ${data.total}`);
      console.log(`   - Structure: ${Object.keys(data).join(', ')}`);
      if (data.data && data.data.length > 0) {
        console.log('   - Premier exposant:', {
          id: data.data[0].id,
          nom: data.data[0].nom,
          domaine: data.data[0].domaine
        });
      }
    } else {
      console.log('❌ Échec:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  console.log('\n=== FIN DES TESTS ===');
}

testAPIEndpoints().catch(console.error);