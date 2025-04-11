#!/usr/bin/env node
/**
 * This script manually triggers the Algolia reindexing process.
 * Run it with: node src/scripts/reindex.js
 */

const API_KEY = 'fc3a2d3d355a05bb237eb10b054a2464'; // Fallback key for local development
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function triggerReindex() {
  console.log('Triggering Algolia reindexing...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/algolia/reindex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secretKey: process.env.ALGOLIA_ADMIN_API_KEY || API_KEY,
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Reindexing successful:');
      console.log(`Products indexed: ${result.count || 'unknown'}`);
      console.log(result.message);
    } else {
      console.error('❌ Reindexing failed:');
      console.error(result.error);
      console.error(result.details || '');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error triggering reindex:');
    console.error(error);
    process.exit(1);
  }
}

// Execute the reindexing
triggerReindex(); 