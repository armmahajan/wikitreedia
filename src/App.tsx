import { useEffect, useState } from 'react';
import './App.css'

import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
// import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import "@react-sigma/core/lib/style.css";

import { fetchArticleLinks, fetchTopArticles } from './api/wikipediaApi.ts'

function App() {
  const [searchInput, setSearchInput] = useState(null)
  const [buttonClicked, setButtonClicked] = useState(false)

  useEffect(() => {
    if (buttonClicked && searchInput) {
      fetchArticleLinks(searchInput).then(
        res => {
          fetchTopArticles(res)
        }
      )
    }
  }, [buttonClicked, searchInput])

  const LoadGraph = () => {
    const { assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();

    // Create graph and add nodes
    useEffect(() => {
      const graph = new Graph();
      graph.addNode("Albert Einstein", {x: 1, y: 0, size: 5, color: "#FFFFFF", label: 'Albert Einstein', labelColor: '#00FFFF'})

      let base = 0;
      // for (let link of linksArray) {
      //   graph.addNode(link['*'], {x: base, y: base, size: 5, color: "#FFFFFF", label: link['*']})
      //   graph.addEdge('Albert Einstein', link['*'])
      //   base++;
      // }
      
      loadGraph(graph);
      assign();
    }, [loadGraph, assign])

    return null 
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col'>
      <div className='flex flex-row justify-center'>
        <input className='bg-white' onInput={(e) => setSearchInput(e.target.value)}></input>
        <button onClick={() => setButtonClicked(!buttonClicked)}>Button</button>
      </div>
      <div className='flex-1/2 bg-black'>
        <SigmaContainer style={{ backgroundColor: 'black', color: 'blue'}} settings={{ allowInvalidContainer: true, labelColor: { color: "#00FFFF"} }}>
          <LoadGraph/>
        </SigmaContainer>
      </div>
    </div>
  )
}

export default App
