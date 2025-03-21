const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch('YUWLMDFM73', '759f34eb01934535c841f508bc5ffb72');

const search = instantsearch({
  indexName: 'd',
  searchClient: algoliasearch(process.env.ALGOLIA_ADMIN_KEY, process.env.ALGOLIA_APP_ID),
  future: { preserveSharedStateOnUnmount: true },
  
});


search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
<article>
  <img src=${ hit.image } alt=${ hit.name } />
  <div>
    <h1>${components.Highlight({hit, attribute: "name"})}</h1>
    <p>${components.Highlight({hit, attribute: "description"})}</p>
  </div>
</article>
`,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

