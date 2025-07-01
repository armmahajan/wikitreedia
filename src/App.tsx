import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import React from 'react';
import './App.css'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import Graph from "graphology";
import Node from "graphology";
import { SigmaContainer, useSigma, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import "@react-sigma/core/lib/style.css";
import { useLocation } from 'react-router'

import { fetchArticleLinks, fetchTopArticles, fetchWikiSearchResults } from './api/wikipediaApi.ts'
import { customDrawHover } from './renderers/drawHover.ts'
import About from './components/About.tsx'
import WikipediaPreview from './components/WikipediaPreview.tsx'

const ClickEvents = React.memo(function ClickEvents({ onNodeClick }: { onNodeClick: (label: string) => void}) {
  const registerEvents = useRegisterEvents()
  const sigma = useSigma();
  useEffect(() => {
    const graph = sigma.getGraph()
    registerEvents({
      clickNode: (e) => {
        const nodeKey = e.node
        const label = graph.getNodeAttribute(nodeKey, "label")
        onNodeClick(label)
      },
      enterNode: (e) => {
        const nodeKey = e.node
        graph.forEachNode((key, attributes) => {
          if (key !== nodeKey) {
            graph.setNodeAttribute(key, 'color', '#726780')
          } else {
            graph.setNodeAttribute(key, 'color', '#548687')
          }
        })
        graph.forEachEdge((key, _, source, target) => {
          if (source !== nodeKey) {
            graph.setEdgeAttribute(key, 'color', '#726780')
          }
          if (source === nodeKey) {
            graph.setNodeAttribute(target, 'color', '#548687')
            graph.setEdgeAttribute(key, 'size', 3)
          }
        })
      },
      leaveNode: (e) => {
        const nodeKey = e.node
        graph.forEachNode((key, attributes) => {
          graph.setNodeAttribute(key, 'color', '#826C7F')
        })
        graph.forEachEdge((key, _, source) => {
          graph.setEdgeAttribute(key, 'color', '#548687')
          graph.setEdgeAttribute(key, 'size', 1)
        })
      }
    })
  }, [onNodeClick, registerEvents, sigma])
  return null
})

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

  // Check if we were provided with an article from homepage
  const location = useLocation()
  useEffect(() => {
    if (location.state?.article) {
      setSelectedArticle(location.state?.article)
      console.log('setting article ', location.state?.article)
    }
  }, [])

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
  const [layoutSlowDown, setLayoutSlowdown] = useState(50)
  const forceUpdate = () => {
    setTick(t => t + 1);
  }
  
  // Updates based on search input
  useEffect(() => {
    if (!selectedArticle) return

    const loadArticles = async () => {
      const initialLinks = await fetchArticleLinks(selectedArticle)
      if (!initialLinks) throw new Error("Could not fetch embedded links of parent article")

      // Add parents top articles to graph
      const topArticles = await fetchTopArticles(initialLinks)
      if (!topArticles) throw new Error("Could not sort articles by viewcount")

      const topArticleTitles = topArticles.map((article) => {
        if (!article) return ''
        return article.title
      })
      addArticleTree(selectedArticle, topArticleTitles, true)
    
      // Add childrens edges into graph
      await Promise.all(
        topArticles.map(async (article) => {
          if (!article) return

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
    graph.addNode(title, {x: Math.random(), y: Math.random(), size: 6, label: title, labelColor: '#00FFFF'})
  }

  const addEdge = (origin: string, dest: string) => {
    const graph = graphRef.current
    if (!graph.hasNode(dest)) return
    graph.addEdge(origin, dest, {
      type: "arrow",
    })
  }

  const addArticleTree = (orig: string, destList: string[], parent: boolean = false) => {
    addNode(orig)
    for (const dest of destList) {
      if (!graphRef.current.hasNode(dest) && parent) addNode(dest)
      addEdge(orig, dest) 
    }
    forceUpdate()
  }

  const LoadGraph = React.memo(() => {
    const loadGraph = useLoadGraph();

    // Create graph and add nodes
    useEffect(() => {
      const graph = graphRef.current
      loadGraph(graph);
    }, [])

    return null 
  })

  const AssignGraph = () => {
    const { start, kill } = useWorkerLayoutForceAtlas2({settings: {
      gravity: 1,
      scalingRatio: 2,
      strongGravityMode: false,
      barnesHutOptimize: true,
      barnesHutTheta: 0.6,
      slowDown: layoutSlowDown
    }});
  
    useEffect(() => {
      start();
    
      const timeoutId = setTimeout(() => {
        setLayoutSlowdown(100000)
        kill()
      }, 2000)

      return () => {
        clearTimeout(timeoutId)
      }

    }, [start, kill, tick])

    return null
  }


  const sigmaSettings = useMemo(() => ({
    labelRenderedSizeThreshold: 1,
    labelFont: "sans-serif",
    hoverLabelColor: "#050517",
    allowInvalidContainer: true,
    labelColor: { color: "#DDD3E0", mode: "default"},
    defaultEdgeColor: "#548687",
    defaultNodeColor: "#826C7F",
    defaultDrawNodeHover: customDrawHover
  }), [])

  const setPreviewArticleCallback = useCallback(setPreviewArticle, [])

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col relative overflow-x-hidden overflow-y-hidden'>
      <WikipediaPreview title={previewArticle}/>
      <div className='flex flex-row gap-1 h-8 justify-center absolute top-5 left-5 z-1000'>
        <Combobox value={selectedArticle} 
          onChange={(value) => {
            setSelectedArticle(value);
            setLayoutSlowdown(50)
            const graph = graphRef.current
            graph.clear()
          }} 
          onClose={() => setQuery('')}>
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
      <div className='flex-1/2 bg-black'>
        <SigmaContainer style={{ backgroundColor: '#16182C', color: 'blue'}} settings={sigmaSettings}>
          <LoadGraph/>
          <ClickEvents onNodeClick={setPreviewArticleCallback}></ClickEvents>
          <AssignGraph/>
        </SigmaContainer>
      </div>
      <About/>
    </div>
  )
}

export default App
