import { useState } from 'react'

function About() {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 w-10 h-10 grid justify-center rounded-full"
        onClick={toggleModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#DDD3E0"><path d="M428-360q0-72 14.5-107.5T503-543q43-37 58-59.5t15-50.5q0-38-27-62.5T480-740q-37 0-65 23t-40 63l-96-40q21-66 76.5-106T480-840q89 0 145 51.5T681-656q0 42-18.5 76.5T596-500q-41 38-50.5 60.5T535-360H428Zm52 216q-30 0-51-21t-21-51q0-30 21-51t51-21q30 0 51 21t21 51q0 30-21 51t-51 21Z"/></svg>
      </button>
    )
  }
  if (isOpen) {
    return (
      <div
        onClick={toggleModal}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-1001"
      >
        <div className="w-1/3 h-max bg-[#161618] rounded-3xl py-4 px-6 flex flex-col text-[#DDD3E0] shadow-2xl">
          <h1>About.</h1>
          <p className="font-light pt-3">Wikitreedia generates visualizations for the network created by embedded articles in Wikipedia articles. 
            This project was inspired by my time spent on Wikipedia while abroad. Want to learn more? Check out the GitHub repo or contact me.
          </p>
          <div className='w-full h-full flex flex-col gap-2 items-center justify-center pt-2'>


            <div className='w-max h-max flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#548687"><path d="M146.67-226.67v-506.66 540-33.34Zm0 66.67q-27 0-46.84-20.17Q80-200.33 80-226.67v-506.66q0-26.34 19.83-46.5Q119.67-800 146.67-800H414l66.67 66.67h332.66q26.34 0 46.5 20.16Q880-693 880-666.67v267.34h-66.67v-267.34H453l-66.67-66.66H146.67v506.66H410V-160H146.67ZM611.33-59.33l-134.66-134 134.66-134 46.67 47-87 87 87 87-46.67 47Zm173.34 0-46.67-47 87-87-87-87 46.67-47 134.66 134-134.66 134Z"/></svg>
              <a href="https://github.com/armmahajan/wikitreedia">
                <p className="hover:text-blue-400 pl-4 text-[#DDD3E0] font-light">Repo</p>
              </a>
            </div>

            <div className='w-max h-max flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 97.707 98.408"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>
              <a href="https://github.com/armmahajan/">
                <p className="hover:text-blue-400 pl-4 text-[#DDD3E0] font-light">GitHub</p>
              </a>
            </div>
            
            <div className='w-max h-max flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="36px" width="36px" version="1.1" id="Layer_1" viewBox="0 0 382 382" xmlSpace="preserve">
                <path className="fill-[#0077B7]" d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889  C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056  H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806  c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1  s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73  c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079  c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426  c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472  L341.91,330.654L341.91,330.654z"/>
              </svg>
              <a href="https://www.linkedin.com/in/armaanmahajan/">
                <p className="hover:text-blue-400 pl-4 text-[#DDD3E0] font-light">LinkedIn</p>
              </a>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default About;
