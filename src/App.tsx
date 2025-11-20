import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout'
import SingleColorSearch from './pages/SingleColorSearch'
import MultiConstraintSearch from './pages/MultiConstraintSearch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SingleColorSearch />} />
          <Route path="multi" element={<MultiConstraintSearch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
