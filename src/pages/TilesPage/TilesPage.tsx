import { useEffect, useState, type FC } from 'react'
import { PriceFilter } from '../../components/PriceFilter/PriceFilter'
import { StageCard } from '../../components/StageCard/StageCard'
import { getLifeCycleStages, type LifeCycleStageTile } from '../../modules/lifeCycleStagesApi'

const TilesPage: FC = () => {
  const [maxPrice, setMaxPrice] = useState('')
  const [stages, setStages] = useState<LifeCycleStageTile[]>([])

  const loadStages = (price: string) => {
    getLifeCycleStages(price === '' ? undefined : Number(price)).then(setStages)
  }

  useEffect(() => {
    getLifeCycleStages().then(setStages)
  }, [])

  return (
    <div className="content">
      <h2>Этапы жизненного цикла</h2>
      <PriceFilter value={maxPrice} onChange={setMaxPrice} onSubmit={() => loadStages(maxPrice)} />
      <ul className="tiles">
        {stages.map((stage) => (
          <StageCard key={stage.id} stage={stage} />
        ))}
      </ul>
    </div>
  )
}

export default TilesPage
