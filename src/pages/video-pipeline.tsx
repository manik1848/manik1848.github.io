import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CaseStudy from '../components/CaseStudy'
import { caseBySlug } from '../data/cases'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaseStudy study={caseBySlug('video-pipeline')} />
  </StrictMode>,
)
