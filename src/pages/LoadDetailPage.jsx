import { useParams } from 'react-router-dom'
import LoadDetail from '../components/loads/LoadDetail'

export default function LoadDetailPage() {
  const { id } = useParams()
  return <LoadDetail loadId={id} />
}
