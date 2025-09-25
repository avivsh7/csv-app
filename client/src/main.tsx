import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SongTable from './components/SongTable'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SongTable />
  </StrictMode>,
)
