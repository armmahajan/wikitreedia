import type { WikiBatchStatsResponse, WikiBatchStatsPages  } from "../models/WikipediaApi";
import { MaxHeap } from 'datastructures-js'
import type { IGetCompareValue } from 'datastructures-js'

export async function fetchArticleLinks(articleName: string): Promise<string[] | null> {
  let encodedArticleName = encodeURIComponent(articleName.replace(/ /g, '_'))
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodedArticleName}&prop=links&format=json&origin=*`)
  const parseJson = await res.json();
  
  if (parseJson) {
    // @TODO: linksArray data model
    const linksArray = parseJson?.parse?.links ?? []
    const encodedLinks = linksArray.map((item) => {
      return encodeURIComponent(item['*'].replace(/ /g, '_'))
    })
    return encodedLinks;
  } else {
    console.error('Could not fetch article links.');
    return null
  }
}

export async function fetchBatchStats(articleList: string[]): Promise<WikiBatchStatsPages | null> {
  // Preconditions
  if (articleList.length > 50) {
    console.error(`Article batch is too long (Length: ${articleList.length})`)
    return null
  }

  // Get results for batch
  let encodedArticleList = articleList.map(articleName => {return encodeURIComponent(articleName.replace(/ /g, '_'))})
  let batchString = encodedArticleList.join('|')
  const res = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageviews&titles=${batchString}&format=json`)
  const stats: WikiBatchStatsResponse = await res.json()
  return stats.query.pages
}

export async function fetchTopArticles(articles: string[], numArticles: number = 200): Promise<{title: string, views: number}[]> {
  function* batchArray<T>(array: T[], batchSize: number = 50): Generator<T[]> {
    for (let i = 0; i < array.length; i += batchSize) {
      yield array.slice(i, i + batchSize);
    }
  }
  
  type articleViews = {
    title: string,
    views: number
  }
  const getViewsCompareValue: IGetCompareValue<Number> = (article: articleViews) => {
     return article.views
  }
  const viewsHeap = new MaxHeap<articleViews>(getViewsCompareValue)

  for (let batch of batchArray(articles)) {
    let res = await fetchBatchStats(batch)
    let yesterday = getYesterdayDateString()
    if (res) {
      let stats = Object.values(res)
      let mostRecentViews = stats.map((stat) => {
        const title = stat['title']
        const views: number = stat?.pageviews?.[yesterday] ?? -1
        return { 'title': title, 'views': views}
      })
      mostRecentViews.forEach((view) => viewsHeap.insert(view))
    }
  }

  // Get top 200 from heap
  let top200 = []
  let count = 200
  while (count > 0 && !viewsHeap.isEmpty()) {
    top200.push(viewsHeap.pop())
    count--
  }

  return top200
}

function getYesterdayDateString(): string {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function fetchWikiSearchResults(query: string): Promise<string[]> {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=10&namespace=0&format=json&origin=*`)  
  const resJson: string[][] = await res.json()
  return resJson[1] ? resJson[1] : []
}
