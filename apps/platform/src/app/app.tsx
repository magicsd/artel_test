import { i18n } from '@artelonline/shared'
import { Routes, Route } from 'react-router-dom'
import { HomePage, AboutPage, DashboardPage } from '../pages'

// Инициализация i18n
i18n

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App
