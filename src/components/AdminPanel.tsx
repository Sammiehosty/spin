import { useState, useEffect } from 'react'
import { Participant } from '../App'

interface AdminPanelProps {
  isLoggedIn: boolean
  onLogin: () => void
  onBack: () => void
}

export default function AdminPanel({ isLoggedIn, onLogin, onBack }: AdminPanelProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  // Obfuscated credentials
  const validUsername = ['d', 'i', 's', 'c', 'o', 'r', 'd'].join('')
  const validPassword = ['s', 'a', 'm', 'm', 'i', 'e', '2', '3', '1', '9', '9', '1'].join('')

  useEffect(() => {
    if (isLoggedIn) {
      loadParticipants()
    }
  }, [isLoggedIn])

  const loadParticipants = () => {
    const stored: Participant[] = JSON.parse(localStorage.getItem('sammie_participants') || '[]')
    // Sort by timestamp, newest first
    stored.sort((a, b) => b.timestamp - a.timestamp)
    setParticipants(stored)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username === validUsername && password === validPassword) {
      onLogin()
    } else {
      setError('Invalid credentials. Access denied.')
    }
  }

  const toggleClaimed = (index: number) => {
    const updated = [...participants]
    updated[index].claimed = !updated[index].claimed
    setParticipants(updated)
    localStorage.setItem('sammie_participants', JSON.stringify(updated))
  }

  const clearAllParticipants = () => {
    localStorage.setItem('sammie_participants', '[]')
    localStorage.setItem('sammie_used_numbers', '[]')
    setParticipants([])
    setShowConfirmClear(false)
  }

  const exportData = () => {
    const csvContent = [
      ['Name', 'WhatsApp', 'Discount (%)', 'Balance (₦)', 'Claimed', 'Date'].join(','),
      ...participants.map(p => [
        p.name,
        p.whatsapp,
        p.discount,
        (10000 - (10000 * p.discount / 100)).toLocaleString(),
        p.claimed ? 'Yes' : 'No',
        new Date(p.timestamp).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sammie_hosty_participants_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const winners = participants.filter(p => p.discount > 0)
  const claimedCount = participants.filter(p => p.claimed).length
  const totalDiscountGiven = winners.reduce((sum, p) => sum + (10000 * p.discount / 100), 0)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-purple-200">Sammie Hosty Dashboard</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                  <p className="text-red-300 text-sm">⚠️ {error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
              >
                🔓 Login to Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-purple-300 text-sm hover:text-white transition"
              >
                ← Back to Spin
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">📊 Admin Dashboard</h1>
            <p className="text-purple-200">Sammie Hosty Spin & Win Management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-300 rounded-lg hover:bg-green-500/30 transition"
            >
              📥 Export CSV
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-purple-200 text-sm mb-1">Total Participants</p>
            <p className="text-3xl font-bold text-white">{participants.length}</p>
            <p className="text-gray-400 text-xs">/ 60 max</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-green-200 text-sm mb-1">Winners</p>
            <p className="text-3xl font-bold text-green-400">{winners.length}</p>
            <p className="text-gray-400 text-xs">/ 24 max (40%)</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-yellow-200 text-sm mb-1">Claimed</p>
            <p className="text-3xl font-bold text-yellow-400">{claimedCount}</p>
            <p className="text-gray-400 text-xs">discounts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <p className="text-red-200 text-sm mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-red-400">₦{totalDiscountGiven.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">for customers</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowConfirmClear(true)}
            className="px-4 py-2 bg-red-500/20 border border-red-400 text-red-300 rounded-lg hover:bg-red-500/30 transition"
          >
            🗑️ Clear All Participants
          </button>
          <button
            onClick={loadParticipants}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400 text-blue-300 rounded-lg hover:bg-blue-500/30 transition"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Confirm Clear Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-red-500/50">
              <h3 className="text-xl font-bold text-white mb-4">⚠️ Confirm Clear All</h3>
              <p className="text-gray-300 mb-6">
                This will remove ALL participants and reset the spin game. This action cannot be undone. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllParticipants}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">👥 Participants List</h2>
          </div>
          
          {participants.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-lg">No participants yet</p>
              <p className="text-gray-500 text-sm mt-2">Participants will appear here after spinning the wheel</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">#</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">WhatsApp</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Discount</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Balance</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-purple-200 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => {
                    const balance = 10000 - (10000 * participant.discount / 100)
                    return (
                      <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 text-gray-300 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-white text-sm font-medium">{participant.name}</td>
                        <td className="px-4 py-3 text-white text-sm">{participant.whatsapp}</td>
                        <td className="px-4 py-3">
                          {participant.discount > 0 ? (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                              {participant.discount}%
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                              No Win
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white text-sm">
                          ₦{balance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(participant.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {participant.claimed ? (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                              ✓ Claimed
                            </span>
                          ) : participant.discount > 0 ? (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {participant.discount > 0 && (
                            <button
                              onClick={() => toggleClaimed(index)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                                participant.claimed
                                  ? 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                              }`}
                            >
                              {participant.claimed ? 'Undo' : 'Mark Claimed'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/5 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">📋 Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-gray-300">Winner (10-35% discount)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="text-gray-300">No discount won</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-300">Pending claim</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="text-gray-300">Claimed discount</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Admin Dashboard • Sammie Hosty • Secure Access
          </p>
        </div>
      </div>
    </div>
  )
}
