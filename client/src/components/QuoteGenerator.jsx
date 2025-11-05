import React, { useEffect, useState } from 'react'
import quote1 from '../assets/quote1.jpg'
import quote2 from '../assets/quote2.jpg'
import quote3 from '../assets/quote3.jpg'

const backgrounds = [quote1, quote2, quote3]

export default function QuotesPage() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bg, setBg] = useState(quote1)

  const fetchQuote = async () => {
    setLoading(true)
    const res = await fetch('/api/quote')
    const data = await res.json()
    setQuote(data.quote)
    // Change background randomly on each click
    const next = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    setBg(next)
    setLoading(false)
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div
      className="quote-page fade-bg"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="card-large quote-card">
        {loading && <div className="muted">Loading...</div>}
        {quote && (
          <>
            <p className="quote-text">“{quote.text}”</p>
            <p className="quote-author">— {quote.author}</p>
          </>
        )}
        <button className="btn-primary" onClick={fetchQuote}>
          New Quote
        </button>
      </div>
    </div>
  )
}
