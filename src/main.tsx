// src/index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Componentes de página
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import AddClientes from './pages/AddClientes.tsx'
import ListagemClientesPage from './pages/ListagemClientesPage.tsx'
import InfoClientes from './pages/InfoCliente.tsx'

import { HeroUIProvider } from "@heroui/react"
import {  createBrowserRouter, useHref, useNavigate, Outlet, RouterProvider } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './layout/RootLayout.tsx'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <HeroUIWithRouter />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        element: <RootLayout />,
        children: [
          {
          path: '/home',
          element: <HomePage />
        },
        {
          path: '/add-cliente',
          element: <AddClientes />
        },
        {
          path: '/listagem-clientes',
          element: <ListagemClientesPage />
        },
         {
          path: '/listagem-clientes/:idUsuario',
          element: <InfoClientes />
        },
        ]
      }
    ]
  }
])

function HeroUIWithRouter() {
  const navigate = useNavigate();
  const useHrefFunc = useHref;

  return (
    <HeroUIProvider navigate={navigate} useHref={useHrefFunc}>
      <Outlet />
    </HeroUIProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>

)
