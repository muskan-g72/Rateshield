import { Link } from 'react-router-dom'
import { Button, Card, CardHeader } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader title="Page not found" description="The page you requested does not exist yet." />
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </Card>
  )
}
