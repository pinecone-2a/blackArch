import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";

// Create a simple REST API interface for Algolia operations
// Avoiding direct client library usage due to TypeScript issues

/**
 * Make a direct API call to Algolia
 */
async function callAlgoliaAPI(method: string, path: string, body?: any) {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;
  
  if (!appId || !apiKey) {
    console.error('Algolia credentials missing');
    return null;
  }

  try {
    const url = `https://${appId}-dsn.algolia.net/1/indexes/${path}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'X-Algolia-API-Key': apiKey,
        'X-Algolia-Application-Id': appId,
      }
    };
    
    if (body) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`Algolia API error: ${responseText}`);
      return null;
    }

    // Parse JSON only if there's content
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error('Error calling Algolia API:', error);
    return null;
  }
}

/**
 * Index a product in Algolia
 * @param product The product to index
 */
export async function indexProduct(product: any) {
  try {
    if (!product || !product.id) {
      console.error('Invalid product object for indexing');
      return false;
    }
    
    const result = await callAlgoliaAPI('POST', INSTANT_SEARCH_INDEX_NAME, {
      objectID: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
      rating: product.rating,
      image: product.image,
      color: product.color,
      size: product.size,
    });
    
    return result ? true : false;
  } catch (error) {
    console.error('Error indexing product in Algolia:', error);
    return false;
  }
}

/**
 * Update a product in Algolia
 * @param product The product to update
 */
export async function updateProduct(product: any) {
  try {
    if (!product || !product.id) {
      console.error('Invalid product object for updating');
      return false;
    }
    
    const result = await callAlgoliaAPI('PUT', `${INSTANT_SEARCH_INDEX_NAME}/${product.id}`, {
      objectID: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
      rating: product.rating,
      image: product.image,
      color: product.color,
      size: product.size,
    });
    
    return result ? true : false;
  } catch (error) {
    console.error('Error updating product in Algolia:', error);
    return false;
  }
}

/**
 * Delete a product from Algolia - using direct API call
 */
export async function deleteProduct(productId: string) {
  try {
    if (!productId) {
      console.error('Invalid product ID for deletion');
      return false;
    }
    
    // Get credentials directly for maximum transparency
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;
    
    if (!appId || !apiKey) {
      console.error('Algolia credentials missing');
      return false;
    }
    
    // Format the URL exactly as in Algolia's documentation
    const url = `https://${appId}-dsn.algolia.net/1/indexes/${INSTANT_SEARCH_INDEX_NAME}/${encodeURIComponent(productId)}`;
    
    // Make the API call with the DELETE method
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-Algolia-API-Key': apiKey,
        'X-Algolia-Application-Id': appId
      }
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Algolia deletion error: ${responseText || response.statusText}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product from Algolia:', error);
    return false;
  }
} 