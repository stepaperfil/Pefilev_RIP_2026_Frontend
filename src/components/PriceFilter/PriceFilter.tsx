import type { FC, SubmitEvent } from 'react'
import { Button, Form } from 'react-bootstrap'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const PriceFilter: FC<Props> = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Form className="filter" onSubmit={handleSubmit}>
      <Form.Control
        type="number"
        name="maxPricePerUnit"
        placeholder="Цена за единицу, ₽"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button type="submit" className="btn-icon" aria-label="Применить фильтр">
        ›
      </Button>
    </Form>
  )
}
