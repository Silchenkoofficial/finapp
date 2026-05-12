import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Carsharing } from '../components/Carsharing'
import { CarsharingSkeleton } from '../components/skeletons/CarsharingSkeleton'

export const Route = createFileRoute('/carsharing')({
  component: CarsharingPage,
})

function CarsharingPage() {
  const { config, isLoading, addCarsharingTrip, deleteCarsharingTrip, addCarsharingTag, deleteCarsharingTag } = useConfig()
  if (isLoading || !config) return <CarsharingSkeleton />
  return (
    <Carsharing
      config={config}
      onAddTrip={addCarsharingTrip}
      onDeleteTrip={deleteCarsharingTrip}
      onAddTag={addCarsharingTag}
      onDeleteTag={deleteCarsharingTag}
    />
  )
}
