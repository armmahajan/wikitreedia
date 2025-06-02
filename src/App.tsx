import { useEffect, useState } from 'react';
import './App.css'

import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import { useLayoutCircular } from '@react-sigma/layout-circular';
import "@react-sigma/core/lib/style.css";

const sigmaStyle = { height: "100px", width: "100px"}

export const LoadGraph = () => {
  const { positions, assign } = useLayoutCircular();
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", {x: 0, y: 0, size: 5, label: "My first node", color: "#FA4F40"});
    graph.addNode("second", {x: 0, y: 0, size: 5, label: "My second node", color: "#FA4F40"});
    graph.addNode("third", {x: 0, y: 0, size: 5, label: "My second node", color: "#FA4F40"});
    graph.addNode("fourth", {x: 0, y: 0, size: 5, label: "My second node", color: "#FA4F40"});
    graph.addNode("fifth", {x: 0, y: 0, size: 5, label: "My second node", color: "#FA4F40"});
    loadGraph(graph);

    requestAnimationFrame(() => {
      assign();
    })
  }, [loadGraph, assign])

  return null 
}


function App() {
  const [internalLinks, setInternalLinks] = useState(null)
  const [searchInput, setSearchInput] = useState(null)
  useEffect(() => {
    console.log(searchInput)
    fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${searchInput}&prop=links&format=json&origin=*`)
      .then(res => res.json())
      .then(setInternalLinks)
    console.log(internalLinks)
  }, [searchInput])


  return (
    <>
      <div>
        <input onInput={(e) => setSearchInput(e.target.value)}></input>
      </div>
      <div>
        <SigmaContainer style={sigmaStyle} settings={{ allowInvalidContainer: true }}>
          <LoadGraph/>
        </SigmaContainer>
      </div>
    </>
  )
}

export default App
