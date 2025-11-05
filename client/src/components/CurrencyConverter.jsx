import React, { useState, useEffect } from 'react'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [rate, setRate] = useState(null)

  useEffect(() => {
    fetchRate()
  }, [from, to])

  const fetchRate = async () => {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    const data = await res.json()
    setRate(data.rates[to])
  }

  return (
    <div className="currency-page">
      <div className="currency-card">
        <h2>Currency Converter</h2>
        <div className="row">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
            <option>JPY</option>
          </select>
          <span>to</span>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
            <option>JPY</option>
          </select>
        </div>
        {rate && (
          <h3 className="result">
            {amount} {from} = {(amount * rate).toFixed(2)} {to}
          </h3>
        )}
      </div>
    </div>
  )
}
