import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.ALGOLIA.ADMIN.KEY,  process.env.ALGOLIA.APP.ID);
const index = client.initIndex('d');  // replace 'your_index_name' with your actual index name

export default index;
