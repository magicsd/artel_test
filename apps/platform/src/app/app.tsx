import { Routes, Route } from 'react-router-dom'
import { HomePage, AboutPage, DashboardPage } from '../pages'

// i18n инициализируется автоматически при импорте shared пакета

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
