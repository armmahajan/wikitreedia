import { useEffect, useState, useRef } from 'react';
import './App.css'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import Graph from "graphology";
import { SigmaContainer, useSigma, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import "@react-sigma/core/lib/style.css";

import { fetchArticleLinks, fetchTopArticles, fetchWikiSearchResults } from './api/wikipediaApi.ts'
import { customDrawHover } from './renderers/drawHover.ts'

import WikipediaPreview from './components/WikipediaPreview.tsx'

function ClickEvents({ onNodeClick }: { onNodeClick: (label: string) => void}) {
  const registerEvents = useRegisterEvents()
  const sigma = useSigma();
  const graph = sigma.getGraph()
  useEffect(() => {
    registerEvents({
      clickNode: (e) => {
        const nodeKey = e.node
        const label = graph.getNodeAttribute(nodeKey, "label")
        onNodeClick(label)
      }
    })
  }, [])

  return null
}

/*
  * GOAL: Add preview on click, style, deploy (also fix rerendering)
  * Todo:
  *   - Customizing settings VERY LOW
  *   - Hover events HIGH
  *     - ALL LOW
  *     - For node hover, option to pull up that graph
  *       - probably easier to add other div that contains preview
  *       - Could do: Click -> Preview + button to pull up that graph instead
  *     - could we hide the current data in the back and just add on?
  *     - if we hover certain nodes can we hide other nodes in the back?
*/

function App() {
  // Combobox state params
  const [selectedArticle, setSelectedArticle] = useState<string | null>('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [previewArticle, setPreviewArticle] = useState<string>('')

  // Update search results
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
  
  // Hooks to allow for dynamic updating of graph data and forceful rerenders
  const graphRef = useRef(new Graph())
  const [tick, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);
  
  // Updates based on search input
  useEffect(() => {
    if (!selectedArticle) return

    const loadArticles = async () => {
      const initialLinks = await fetchArticleLinks(selectedArticle)
      if (!initialLinks) throw new Error("Could not fetch embedded links of parent article")

      // Add parents top articles to graph
      const topArticles = await fetchTopArticles(initialLinks)
      if (!topArticles) throw new Error("Could not sort articles by viewcount")

      const topArticleTitles = topArticles.map((article) => article.title)
      addArticleTree(selectedArticle, topArticleTitles, true)
    
      // Add childrens edges into graph
      await Promise.all(
        topArticles.map(async (article) => {
          const embeddedLinks = await fetchArticleLinks(article.title)
          if (!embeddedLinks) throw new Error('Could not get embedded links for an article')

          addArticleTree(article.title, embeddedLinks)
        })
      )
    }

    loadArticles()
  }, [selectedArticle])
  
  const addNode = (title: string) => {
    const graph = graphRef.current
    if (graph.hasNode(title)) return
    graph.addNode(title, {x: Math.random(), y: Math.random(), size: 4, label: title, labelColor: '#00FFFF'})
  }

  const addEdge = (origin: string, dest: string) => {
    const graph = graphRef.current
    if (!graph.hasNode(dest)) return
    graph.addEdge(origin, dest)
  }

  const addArticleTree = (orig: string, destList: string[], parent: boolean = false) => {
    addNode(orig)
    for (const dest of destList) {
      if (!graphRef.current.hasNode(dest) && parent) addNode(dest)
      addEdge(orig, dest) 
    }
    forceUpdate()
  }


  const LoadGraph = () => {
    const { assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();

    // Create graph and add nodes
    useEffect(() => {
      const graph = graphRef.current
      loadGraph(graph);
      assign();
    }, [loadGraph, assign, tick])

    return null 
  }



  const sigmaSettings = {
    labelRenderedSizeThreshold: 1,
    labelFont: "sans-serif",
    hoverLabelColor: "#050517",
    allowInvalidContainer: true,
    labelColor: { color: "#DDD3E0", mode: "default"},
    defaultEdgeColor: "#548687",
    defaultNodeColor: "#826C7F",
    defaultDrawNodeHover: customDrawHover
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col relative overflow-x-hidden overflow-y-hidden'>
      <WikipediaPreview title={previewArticle}/>
      <div className='flex flex-row gap-1 h-8 justify-center absolute top-5 left-5 z-1000'>
        <Combobox value={selectedArticle} 
          onChange={(value) => {
            setSelectedArticle(value);
            const graph = graphRef.current
            graph.clear()
          }} 
          onClose={() => setQuery('')}>
          <ComboboxInput 
            className=""
            onChange={(event) => {setQuery(event.target.value)}}>
          </ComboboxInput>
          <ComboboxOptions anchor="bottom" 
            className="">
            {
              searchResults.map((result) => (
                <ComboboxOption key={result} value={result}>{result}</ComboboxOption>
              ))
            }
          </ComboboxOptions>
        </Combobox>
      </div>
      <div className='flex-1/2 bg-black'>
        <SigmaContainer style={{ backgroundColor: '#16182C', color: 'blue'}} settings={sigmaSettings}>
          <LoadGraph/>
          <ClickEvents onNodeClick={setPreviewArticle}></ClickEvents>
        </SigmaContainer>
      </div>
    </div>
  )
}

export default App
