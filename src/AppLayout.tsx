import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { TabBar } from './components/TabBar/TabBar'

export const AppLayout: FC = () => (
  <div className="app">
    <Outlet />
    <TabBar />
  </div>
)
