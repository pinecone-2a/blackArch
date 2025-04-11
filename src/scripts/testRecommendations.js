#!/usr/bin/env node
/**
 * This script tests the Algolia recommendations API by fetching similar products for a product ID.
 * Run it with: node src/scripts/testRecommendations.js [PRODUCT_ID]
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Get product ID from command line or use a default
const productId = process.argv[2] || '67f2353830fdeea617b0ee73'; // Example product ID

async function testRecommendations() {
  console.log(`Testing recommendations API for product: ${productId}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/recommendations?objectID=${productId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Recommendations API response:');
      
      if (result.results && 
          result.results[0] && 
          result.results[0].hits && 
          result.results[0].hits.length > 0) {
        
        console.log(`Found ${result.results[0].hits.length} similar products:`);
        
        // Display found products in a table format
        result.results[0].hits.forEach((product, index) => {
          console.log(`\n[${index + 1}] ${product.name}`);
          console.log(`   ID: ${product.objectID}`);
          console.log(`   Category: ${product.categoryName || 'N/A'}`);
          console.log(`   Price: ${product.price}`);
        });
      } else {
        console.log('No similar products found.');
      }
    } else {
      console.error('❌ API request failed:');
      console.error(result.error || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing recommendations:');
    console.error(error);
    process.exit(1);
  }
}

// Execute the test
testRecommendations(); 