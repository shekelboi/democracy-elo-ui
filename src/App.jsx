import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import IndexPage from './pages/IndexPage'
import StatisticsPage from './pages/StatisticsPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
      </Routes>
    </Layout>
  )
}
