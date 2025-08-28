// Debug script to simulate frontend behavior
const debugFrontend = async () => {
  console.log('=== Debugging Frontend Data Loading ===\n');
  
  // Simulate frontend behavior
  const simulateFrontend = async () => {
    console.log('1. Simulating frontend startup...');
    
    // Check if we have a token (simulate localStorage)
    const token = 'Bearer debug-token'; // Simulate what frontend would have
    console.log('✅ Using token:', token);
    
    console.log('\n2. Attempting to fetch exposants...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/exposants', {
        headers: {
          'Authorization': token
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched data');
        console.log('Data structure:', {
          success: data.success,
          total: data.total,
          dataCount: data.data?.length || 0
        });
        
        if (data.data && data.data.length > 0) {
          console.log('\nFirst exposant:');
          const first = data.data[0];
          console.log('- ID:', first.id);
          console.log('- Name:', first.nom);
          console.log('- Domain:', first.domaine);
          console.log('- Status:', first.statutConfirmation);
          console.log('- Has Payment Status:', 'statutPaiement' in first);
          
          // Check if the data structure matches frontend interface
          const requiredFields = ['id', 'nom', 'description', 'domaine', 'statutConfirmation'];
          const missingFields = requiredFields.filter(field => !(field in first));
          
          if (missingFields.length === 0) {
            console.log('✅ All required fields present');
          } else {
            console.log('❌ Missing fields:', missingFields);
          }
        }
        
        return data;
      } else {
        console.log('❌ Failed to fetch data');
        const errorText = await response.text();
        console.log('Error:', errorText);
        return null;
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
      return null;
    }
  };
  
  const data = await simulateFrontend();
  
  if (data) {
    console.log('\n3. Simulating frontend state update...');
    console.log('✅ Frontend would setExposants() with', data.data.length, 'items');
    console.log('✅ Frontend would setLoading(false)');
    console.log('✅ Frontend would render the list');
    
    // Check if the data matches what frontend expects
    const frontendInterface = {
      id: 'string',
      nom: 'string',
      description: 'string',
      domaine: 'string',
      logo: 'string?',
      siteWeb: 'string?',
      statutConfirmation: '"CONFIRME" | "EN_ATTENTE"',
      createdAt: 'string',
      updatedAt: 'string'
    };
    
    console.log('\n4. Interface compatibility check:');
    const sample = data.data[0];
    Object.keys(frontendInterface).forEach(key => {
      const hasKey = key in sample;
      const expectedType = frontendInterface[key];
      const actualType = typeof sample[key];
      const typeMatches = expectedType.includes('string') ? actualType === 'string' : actualType === expectedType;
      
      console.log(`  ${key}: ${hasKey ? '✅' : '❌'} present, type ${typeMatches ? '✅' : '❌'} matches`);
    });
  }
  
  console.log('\n=== Debug Complete ===');
};

debugFrontend();