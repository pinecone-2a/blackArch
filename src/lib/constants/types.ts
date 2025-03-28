

export type User = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user"; // Ensure role is properly typed
  };
  


  export const INSTANT_SEARCH_INDEX_NAME = 'products';
export const INSTANT_SUGGESTIONS_INDEX = 'products_query_suggestions';
export const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES = ['category', 'title', 'query', 'description'];