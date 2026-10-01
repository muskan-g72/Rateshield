import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <Card className="p-8">
        <span className="font-mono text-4xl font-extrabold text-no">404</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you requested could not be located.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="primary">Return home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
