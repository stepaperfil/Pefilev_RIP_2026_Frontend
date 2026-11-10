import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { PriceFilter } from '../../components/PriceFilter/PriceFilter'
import { StageCard } from '../../components/StageCard/StageCard'
import type { LifeCycleStageTile } from '../../modules/lifeCycleStagesApi'
import { deleteLifeCycleStage, loadLifeCycleStages } from '../../modules/lifeCycleStageThunks'
import { applyPrice, selectBusy, setMaxPrice, useAppDispatch, useAppSelector } from '../../store'

export default function TilesPage() {
  const dispatch = useAppDispatch()
  const { maxPrice, appliedPrice } = useAppSelector((state) => state.lifeCycleStages)
  const token = useAppSelector((state) => state.session.token)
  const busy = useAppSelector(selectBusy)
  const [stages, setStages] = useState<LifeCycleStageTile[]>([])
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const request = dispatch(loadLifeCycleStages(appliedPrice === '' ? undefined : Number(appliedPrice)))
    let active = true
    request.unwrap().then((data) => {
      if (!active) return
      setError('')
      setStages(data)
    })
      .catch((error: unknown) => {
        if (!active) return
        setStages([])
        setError(String(error))
      })
    return () => { active = false; request.abort() }
  }, [appliedPrice, dispatch, refresh, token])

  const remove = async (stage: LifeCycleStageTile) => {
    if (!window.confirm(`Удалить этап «${stage.title}»?`)) return
    setError('')
    try {
      await dispatch(deleteLifeCycleStage(stage.id)).unwrap()
      setStages((current) => current.filter(({ id }) => id !== stage.id))
    } catch (error) {
      setError(String(error))
    }
  }

  const submitPrice = () => {
    dispatch(applyPrice())
    setRefresh((value) => value + 1)
  }

  return (
    <div className="content">
      <h2>Этапы жизненного цикла</h2>
      <PriceFilter value={maxPrice} onChange={(value) => dispatch(setMaxPrice(value))}
        onSubmit={submitPrice} disabled={busy} />
      {error && <Alert variant="danger">{error}</Alert>}
      <ul className="tiles">
        {stages.map((stage) => (
          <StageCard key={stage.id} stage={stage} disabled={busy}
            onRemove={token && stage.is_mine === 1 ? () => remove(stage) : undefined} />
        ))}
      </ul>
      {!busy && !error && !stages.length && <p className="feed-notice">Этапы не найдены.</p>}
    </div>
  )
}
