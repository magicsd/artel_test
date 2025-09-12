import { QueryProvider, ThemeProvider } from '@artelonline/shared'
import { Toaster } from '@artelonline/ui'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components'
import { HomePage, AboutPage, DashboardPage, LoginPage, RegisterPage } from '../pages'

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="artel-ui-theme">
        <Routes>
          {/* Auth routes without layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
