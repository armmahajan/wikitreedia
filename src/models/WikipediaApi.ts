export interface WikiBatchStatsResponse {
  query: {
    pages: {
      [pageId: string]: {
        title: string,
        pageviews?: {
          [date: string] : {
            views: number
          }
        }[];
      };
    };
  };
}

export type WikiBatchStatsPages = WikiBatchStatsResponse['query']['pages']
