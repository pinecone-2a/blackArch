import { InstantSearch, InstantSearchProps } from "react-instantsearch";

interface NextInstantSearchProps extends InstantSearchProps {
    children: React.ReactNode
}



export default function NextInstantSearch(props:NextInstantSearchProps) {
    return InstantSearch(props) as React.ReactNode
}