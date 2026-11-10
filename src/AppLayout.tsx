import type { FC } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { TabBar } from './components/TabBar/TabBar'
import { selectBusy, useAppSelector } from './store'
import { useState } from 'react'

export const AppLayout: FC = () => {
  const busy = useAppSelector(selectBusy)
  const [error, setError] = useState('')

  return (
    <div className="app" aria-busy={busy}>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <Outlet />
      <TabBar onError={setError} />
      {busy && <div className="tco-loading" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Загрузка</span>
      </div>}
    </div>
  )
}
