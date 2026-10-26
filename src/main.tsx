import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import './styles/life_cycle_stages_style.css'
import './styles/life_cycle_stage_style.css'
import './styles/tabbar.css'
import './styles/bootstrap_fix.css'
import { AppLayout } from './AppLayout'
import { ROUTES } from './Routes'
import TilesPage from './pages/TilesPage/TilesPage'
import FeedPage from './pages/FeedPage/FeedPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.TILES} replace /> },
      { path: ROUTES.TILES, element: <TilesPage /> },
      { path: ROUTES.FEED, element: <FeedPage /> },
      { path: `${ROUTES.FEED}/:id`, element: <FeedPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
