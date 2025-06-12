import { useEffect, useState } from 'react';
import './App.css'

import { MaxPriorityQueue } from '@datastructures-js/priority-queue';

import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
import { useLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2'
import "@react-sigma/core/lib/style.css";

const sigmaStyle = { height: "100px", width: "100px"}



function App() {
  const [parseJson, setParseJson] = useState(null)
  const [searchInput, setSearchInput] = useState(null)
  const [buttonClicked, setButtonClicked] = useState(false)
  const [stats, setStats] = useState()

  useEffect(() => {
    if (buttonClicked) {
    fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=Albert_Einstein&prop=links&format=json&origin=*`)
      .then(res => res.json())
      .then(setParseJson)
    }
  }, [buttonClicked])

  const LoadGraph = () => {
    const { assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();
    
    // https://en.wikipedia.org/w/api.php?action=query&prop=pageviews&titles=Article1|Article2|Article3&format=json

    // Create graph and add nodes
    useEffect(() => {
      const graph = new Graph();
      graph.addNode("Albert Einstein", {x: 1, y: 0, size: 5, color: "#FFFFFF", label: 'Albert Einstein', labelColor: '#00FFFF'})

      const linksArray = parseJson ? parseJson.parse.links : [];
      const encodedLinks = linksArray.map(item => {
        return encodeURIComponent(item['*'].replace(/ /g, '_'))
      })

      function* batchArray<T>(array: T[], batchSize: number): Generator<T[]> {
        for (let i = 0; i < array.length; i += batchSize) {
          yield array.slice(i, i + batchSize);
        }
      }
      
      let viewArticleMap = {}
      for (let batch of batchArray(encodedLinks, 50)) {
        let articleList = batch.join('|')
        fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageviews&titles=${articleList}&format=json`)        
          .then(res => res.json())
          .then(setStats)
        if (stats) {
          const pageIds = Object.keys(stats.query.pages)
          const pages = stats.query.pages
          for (let pageId of pageIds) {
            const page = pages[pageId]
            const pageViews = page.pageviews
            const dates = Object.keys(pageViews)
            dates.sort().pop()
            const latest = dates.pop()
            const viewCount = pageViews[latest]
            if (!viewArticleMap[viewCount]) {
              viewArticleMap[viewCount] = [page.title]
            }
            else {
              viewArticleMap[viewCount].push(page.title)
            }
            // TODO: Filter by Template: and Wikipedia:
          }
        }
      }
      console.log(viewArticleMap)
      
      let base = 0;
      for (let link of linksArray) {
        graph.addNode(link['*'], {x: base, y: base, size: 5, color: "#FFFFFF", label: link['*']})
        graph.addEdge('Albert Einstein', link['*'])
        base++;
      }
      
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
