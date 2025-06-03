import { useEffect, useState } from 'react';
import './App.css'

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

  useEffect(() => {
    if (buttonClicked) {
    fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=Albert_Einstein&prop=links&format=json&origin=*`)
      .then(res => res.json())
      .then(setParseJson)
    }
  }, [buttonClicked])



  const LoadGraph = () => {
    const { positions, assign } = useLayoutForceAtlas2();
    const loadGraph = useLoadGraph();
    useEffect(() => {
      const graph = new Graph();
      graph.addNode("Albert Einstein", {x: 1, y: 0, size: 5, color: "#FFFFFF", label: 'Albert Einstein', labelColor: '#00FFFF'})

      const linksArray = parseJson ? parseJson.parse.links : [];
      console.log('Iterating through links')
      let base = 0;
      for (let link of linksArray) {
        console.log(link)
        graph.addNode(link['*'], {x: base, y: base, size: 5, color: "#FFFFFF", label: link['*']})
        graph.addEdge('Albert Einstein', link['*'])
        base++;
      }
      console.log('Done adding to graph')
      
      loadGraph(graph);

      requestAnimationFrame(() => {
        assign();
      })
      console.log('Done assigning')
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
