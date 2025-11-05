import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import WeatherPage from './components/WeatherModule'
import CurrencyPage from './components/CurrencyConverter'
import QuotesPage from './components/QuoteGenerator'
import './index.css'

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <nav className="nav">
          <NavLink to="/" className="nav-btn">Weather</NavLink>
          <NavLink to="/currency" className="nav-btn">Currency</NavLink>
          <NavLink to="/quotes" className="nav-btn">Quotes</NavLink>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<WeatherPage />} />
            <Route path="/currency" element={<CurrencyPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
          </Routes>
        </main>

        <footer style={{ textAlign: 'center', padding: '10px', color: 'var(--muted)' }}>
          Built with React + Express · Demo-ready
        </footer>
      </div>
    </Router>
  )
}
