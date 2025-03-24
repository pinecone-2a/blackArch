import React from 'react'
import { Highlight }  from 'react-instantsearch'

export default function HitComponent({ hit }) {
  return (
    <div className='flex items-center gap-4 flex-col'>
        {/* <h1 className='font-bold text-red-500'>{hit.title}</h1> */}
        <Highlight hit={hit} attribute={'title'} />
        <p>{hit.description}</p>
    </div>
  )
}