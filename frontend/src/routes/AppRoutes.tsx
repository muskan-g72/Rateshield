import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ApiKeysPage } from '@/pages/ApiKeysPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DocumentationPage } from '@/pages/DocumentationPage'
import { GatewayPage } from '@/pages/GatewayPage'
import { HealthPage } from '@/pages/HealthPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { UpgradePage } from '@/pages/UpgradePage'
import { GuestRoute } from '@/routes/GuestRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="docs" element={<DocumentationPage />} />

          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="gateway" element={<GatewayPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
