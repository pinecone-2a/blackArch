import { liteClient as algoliasearch } from 'algoliasearch/lite';
import dotenv from 'dotenv';
require('dotenv').config()


const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

console.log('Algolia App ID:', appId);
console.log('Algolia API Key:', apiKey);

if(!appId || !apiKey){
    throw new Error('algolia app id or api key is missing...');
}

// Create the search client
const searchClient = algoliasearch(appId, apiKey);

// Setup the client for faceting
const defaultSettings = {
  attributesForFaceting: [
    'searchable(price)',
    'searchable(categoryId)',
    'searchable(size)',
    'searchable(color)',
    'searchable(type)'
  ]
};

// Export the configured client
export { searchClient };