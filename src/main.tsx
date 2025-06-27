// src/index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Componentes de página
import LoginPage from './pages/LoginPage.tsx'


import { HeroUIProvider } from "@heroui/react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <HeroUIProvider>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </HeroUIProvider>
)
