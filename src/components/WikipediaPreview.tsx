import React, { useEffect, useState } from "react";

interface WikipediaPreviewProps {
  title: string; // e.g., "Albert_Einstein"
}

interface WikiExtract {
  extract: string;

  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  title: string;
}

const WikipediaPreview: React.FC<WikipediaPreviewProps> = ({ title }) => {
  const [data, setData] = useState<WikiExtract | null>(null);
  const [visible, setVisible] = useState<boolean>(false)
  // const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!title) return;

    const fetchPreview = async () => {
      // setLoading(true);
      setVisible(true)
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch Wikipedia summary:", e);
        setData(null);
      } finally {
        // setLoading(false);
      }
    };

    fetchPreview();
  }, [title]);

  if (!data) return (
    <div className={`
      absolute left-4 transform flex items-center justify-center
      transition-transform duration-700 ease-out
      bottom-4
      z-1000 min-w-60 w-1/6 h-[5vh] px-2 pb-2 pt-1 bg-[#161618] rounded-lg shadow-2xl">
      `}
    >
      <p>
        Click on a node to view an article preview!
      </p>
    </div>
  )

  return (
    <>
      <div className={`
        absolute left-4 transform
        transition-transform duration-700 ease-out
        ${visible ? 'translate-y-0 bottom-4' : 'translate-y-full bottom-0'}
        z-1000 min-w-60 w-1/6 h-[40vh] px-2 pb-2 pt-1 bg-[#161618] rounded-lg shadow-2xl">
        `}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center">
            <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
              <h2 className="font-semibold text-lg text-gray-100 hover:text-blue-400">{data.title}</h2>
            </a>
            <svg onClick={() => {setVisible(!visible)}} className="hover:fill-[#548687] hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>
          <div className='overflow-y-scroll'>
            {data.thumbnail && (
              <img
                src={data.thumbnail.source}
                alt={data.title}
                className="w-full object-cover rounded-md pr-1"
              />
            )}
            <p className="w-full text-sm text-gray-200 text-justify pr-1">{data.extract !== "" ? data.extract : 'No summary found for this article.' }</p>
          </div>
        </div>
      </div>
    </>
  );
};


export default WikipediaPreview;
