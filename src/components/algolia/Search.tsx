"use client"

import { searchClient } from "@/lib/algolia/searchClient";
import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";
import React from "react";
import { Configure } from "react-instantsearch";
import { Hits } from "react-instantsearch";
import Autocomplete from "./AutoComplete";
import HitComponent from "@/components/algolia/HitComponent";
import CustomPagination from "./CustomPagination";
import PopularSearches from "./PopularSearches";
import NextInstantSearch from "./NextInstantSearch";

interface HitType {
  objectID: string;
  [key: string]: any;
  title: string;
  description: string;
}

export default function SearchAlgolia() {
  return (
    <NextInstantSearch
      initialUiState={{
        posts: {
          query: "",
          page: 1,
        },
      }}
      searchClient={searchClient}
      indexName={INSTANT_SEARCH_INDEX_NAME}
      routing
      insights
      future={{
        preserveSharedStateOnUnmount: true,
        persistHierarchicalRootCount: true,
      }}
    >
      <Configure hitsPerPage={6} distinct={true} getRankingInfo={true} />
      <div className="flex flex-col items-center">
        {/* the autocomplete input and some hits or data to be shown */}
        <Autocomplete
          searchClient={searchClient}
          placeholder="Search for any post..."
          detachedMediaQuery="none"
          className="rounded-none border-none w-[60%]"
          openOnFocus
        />
        {/* add the popular search queries */}
        <PopularSearches queries={['top', 'ultimate', 'not result', 'guide']} />
      </div>

      <div className="mt-8 flex items-center gap-4 flex-col ">
        {/* the hits or the data */}
        <Hits<HitType> hitComponent={({ hit }) => <HitComponent hit={hit} />} />
        {/* the pagination */}
        <CustomPagination />
      </div>
    </NextInstantSearch>
  );
}