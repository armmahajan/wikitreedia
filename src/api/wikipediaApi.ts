import { Mutex } from 'async-mutex';

export async function fetchArticleLinks(articleName: string) {
  encodedArticleName = encodeURIComponent(articleName['*'].replace(/ /g, '_'))
  let parseJson = null

  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodedArticleName}&prop=links&format=json&origin=*`)
  const parseJson = await res.json();
  
  if (parseJson) {
    const linksArray = parseJson.parse.links; 
  } else {
    console.error('Could not fetch article links.')
  }
}

export async function fetchArticleBatch(articleList: list) {
  // Get results for this batch
  const res = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageviews&titles=${articleList}&format=json`)        
  const stats = await res.json()
  // TODO: add async mutex for heap pushes
  const mutex = new Mutex()
}

export async function fetchTopArticles(numArticles: number = 200) {
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
    

}




    
useEffect(() => {
  const graph = new Graph();
  graph.addNode("Albert Einstein", {x: 1, y: 0, size: 5, color: "#FFFFFF", label: 'Albert Einstein', labelColor: '#00FFFF'})

  // const linksArray = parseJson ? parseJson.parse.links : [];
  // const encodedLinks = linksArray.map(item => {
  //   return encodeURIComponent(item['*'].replace(/ /g, '_'))
  // })

  



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
