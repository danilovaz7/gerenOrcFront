// src/index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Componentes de página
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import AddClientes from './pages/AddClientesPage.tsx'
import ListagemClientesPage from './pages/ListagemClientesPage.tsx'
import InfoClientes from './pages/InfoCliente.tsx'
import AddOrcamentos from './pages/AddOrcamentosPage.tsx'
import ListagemOrcamentoPage from './pages/ListagemOrcamentoPage.tsx'
import ListagemProcedimentoPage from './pages/ListagemProcedimentoPage.tsx'

import { HeroUIProvider } from "@heroui/react"
import {  createBrowserRouter, useHref, useNavigate, Outlet, RouterProvider } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './layout/RootLayout.tsx'
import RedefinirSenhaPage from './pages/RedefinirSenhaPage.tsx'

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
        path: "/redefinir-senha/:token",
        element: <RedefinirSenhaPage />,
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
          path: '/add-orcamento',
          element: <AddOrcamentos />
        },
        {
          path: '/listagem-clientes',
          element: <ListagemClientesPage />
        },
         {
          path: '/listagem-clientes/:idUsuario',
          element: <InfoClientes />
        },
         {
          path: '/listagem-orcamentos',
          element: <ListagemOrcamentoPage />
        },
         {
          path: '/listagem-procedimentos',
          element: <ListagemProcedimentoPage />
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
