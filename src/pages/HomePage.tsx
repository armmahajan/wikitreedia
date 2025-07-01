import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { fetchWikiSearchResults } from '../api/wikipediaApi.ts'
import About from '../components/About.tsx'

function HomePage() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [query, setQuery] = useState('')
  
  const navigate = useNavigate();
  useEffect(() => {
    const updateCombobox = async () => {
      const results = await fetchWikiSearchResults(query)
      if (!results) throw new Error('Unable to fetch autocomplete results.')
      setSearchResults(results)
    }

    const timeoutId = setTimeout(() => {
      updateCombobox()
    }, 200);

    return () => {
      clearTimeout(timeoutId)
    }
  }, [query])

  useEffect(() => {
    if (selectedArticle) {
      navigate('/graph', { state: { article: selectedArticle}})
    }
  }, [selectedArticle])

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex justify-center bg-linear-to-r from-[#121212] to-[#548687]">
        <div className="h-[100vh] w-[50vw] flex flex-col gap-4 items-center justify-center">
          <div>
            <h1>Wikitreedia</h1>
            <p>View Wikipedia articles as a network.</p>
          </div>
          <Combobox value={selectedArticle} 
            onChange={(value) => {
              setSelectedArticle(value);
            }} 
            onClose={() => setQuery('')}
          >
            <ComboboxInput 
              autoComplete="off"
              placeholder="Search Wikipedia"
              className="w-full rounded-lg border-none bg-gray-50 py-1.5 pr-8 pl-3 text-sm text-black"
              onChange={(event) => {setQuery(event.target.value)}}>
            </ComboboxInput>
            <ComboboxOptions anchor="bottom" 
              className="w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1
                        [--anchor-gap:--spacing(1)] empty:invisible transition duration-100
                        ease-in data-leave:data-closed:opacity-0">
              {
                searchResults.map((result) => (
                  <ComboboxOption key={result} value={result}
                    className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none
                              data-focus:bg-white/10"
                  >{result}</ComboboxOption>
                ))
              }
            </ComboboxOptions>
          </Combobox>
        </div>
        <About/>
      </div>
    </>
  )
}

export default HomePage
