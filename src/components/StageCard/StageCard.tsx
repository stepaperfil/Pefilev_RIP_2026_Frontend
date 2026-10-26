import type { FC, SyntheticEvent } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DEFAULT_IMAGE, type LifeCycleStageTile } from '../../modules/lifeCycleStagesApi'
import { formatPrice } from '../../modules/format'
import { ROUTES } from '../../Routes'

interface Props {
  stage: LifeCycleStageTile
}

const showDefaultImage = (event: SyntheticEvent<HTMLImageElement>) => {
  if (!event.currentTarget.src.endsWith(DEFAULT_IMAGE)) {
    event.currentTarget.src = DEFAULT_IMAGE
  }
}

export const StageCard: FC<Props> = ({ stage }) => (
  <Card as="li" className="tile">
    <Link to={`${ROUTES.FEED}/${stage.id}`}>
      <Card.Img
        className="tile-image"
        src={stage.image_url || DEFAULT_IMAGE}
        alt={stage.title}
        onError={showDefaultImage}
      />
      <Card.Body className="tile-body">
        <span className="tile-title">{stage.title}</span>
        <div className="tile-meta">
          <div className="tile-price-block">
            <span className="tile-caption">цена за единицу</span>
            <span className="tile-price">{formatPrice(stage.price_per_unit)}</span>
          </div>
          <span className="tile-likes">💚 {stage.likes_count}</span>
        </div>
      </Card.Body>
    </Link>
  </Card>
)
