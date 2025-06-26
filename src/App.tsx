import { useEffect, useState, useRef } from 'react';
import './App.css'

import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import "@react-sigma/core/lib/style.css";

import { fetchArticleLinks, fetchTopArticles } from './api/wikipediaApi.ts'

/*
  * Todo:
  *   - Node color gradient based on number of edges
  *   - Customizing settings
  *   - Autocomplete
  *   - Hover events
  *     - For node hover, option to pull up that graph
  *     - could we hide the current data in the back and just add on?
  *     - if we hover certain nodes can we hide other nodes in the back?
*/

function App() {
  const [searchInput, setSearchInput] = useState(null)
  const [buttonClicked, setButtonClicked] = useState(false)
  
  // Hooks to allow for dynamic updating of graph data and forceful rerenders
  const graphRef = useRef(new Graph())
  const [tick, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);
  
  // Updates based on search input
  useEffect(() => {
    
    if (!buttonClicked || !searchInput) return;

    const loadArticles = async () => {
      const initialLinks = await fetchArticleLinks(searchInput)
      if (!initialLinks) throw new Error("Could not fetch embeddedLinks of parent article")

      // Add parents top articles to graph
      const topArticles = await fetchTopArticles(initialLinks)
      if (!topArticles) throw new Error("Could not sort articles by viewcount")

      let topArticleTitles = []
      for (const article of topArticles) {
        if (article) {
          topArticleTitles.push(article.title)
        }
      }
      addArticleTree(searchInput, topArticleTitles, true)
    
      // Add childrens edges into graph
      for (const article of topArticles) {
        const title = article.title
        const embeddedLinks = await fetchArticleLinks(title)

        if (embeddedLinks) {
          addArticleTree(title, embeddedLinks)
        }
      }
    }

    loadArticles()
    console.log(graphRef.current)
  }, [buttonClicked, searchInput])
  
  const addNode = (title: string) => {
    const graph = graphRef.current
    if (graph.hasNode(title)) return
    graph.addNode(title, {x: Math.random(), y: Math.random(), size: 5, color: "#FFFFFF", label: title, labelColor: '#00FFFF'})
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
    console.log(graphRef.current.edges())
  }

  const LoadGraph = () => {
    const { assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();

    // Create graph and add nodes
    useEffect(() => {
      const graph = graphRef.current
      loadGraph(graph);
      console.log('Reloading')
      assign();
    }, [loadGraph, assign, tick])

    return null 
  }

  const sigmaSettings = {
    labelRenderedSizeThreshold: 0,
    labelFont: "sans-serif",
    allowInvalidContainer: true,
    labelColor: { color: "#000", mode: "default"}
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col'>
      <div className='flex flex-row justify-center'>
        <input className='bg-white' onInput={(e) => setSearchInput(e.target.value)}></input>
        <button onClick={() => setButtonClicked(!buttonClicked)}>Button</button>
      </div>
      <div className='flex-1/2 bg-black'>
        <SigmaContainer style={{ backgroundColor: 'darkgrey', color: 'blue'}} settings={sigmaSettings}>
          <LoadGraph/>
        </SigmaContainer>
      </div>
    </div>
  )
}

export default App
