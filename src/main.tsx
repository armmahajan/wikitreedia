import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>

      <Routes>
        <Route path='graph' element={<App/>}/>
        <Route path='' element={<HomePage />}/>
      </Routes>

    </StrictMode>
  </BrowserRouter>
)
