import { useState } from 'react'

interface RegistrationFormProps {
  onComplete: (name: string, whatsapp: string) => void
  onAdminClick: () => void
}

export default function RegistrationForm({ onComplete, onAdminClick }: RegistrationFormProps) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!whatsapp.trim() || whatsapp.length < 11) {
      setError('Please enter a valid WhatsApp number')
      return
    }

    const usedNumbers: string[] = JSON.parse(localStorage.getItem('sammie_used_numbers') || '[]')
    if (usedNumbers.includes(whatsapp)) {
      setError('This WhatsApp number has already participated in the spin!')
      return
    }

    onComplete(name.trim(), whatsapp.trim())
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Obfuscated credentials check
    const u = ['d', 'i', 's', 'c', 'o', 'r', 'd'].join('')
    const p = ['s', 'a', 'm', 'm', 'i', 'e', '2', '3', '1', '9', '9', '1'].join('')
    
    if (adminUsername === u && adminPassword === p) {
      onAdminClick()
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-4xl">🎰</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Sammie Hosty</h1>
          <p className="text-purple-200 text-lg">Spin & Win Renewal Discount!</p>
          <div className="mt-4 bg-yellow-500/20 border border-yellow-400 rounded-lg p-3">
            <p className="text-yellow-300 text-sm font-medium">
              🎉 Win 10% - 35% OFF your hosting renewal!
            </p>
          </div>
        </div>

        {/* Registration Form */}
        {!showAdminLogin ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Enter Your Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="e.g., 08012345678"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
              >
                🎰 Start Spinning!
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-purple-300 text-sm hover:text-white transition"
              >
                Admin Login
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">🔐 Admin Login</h2>
            
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowAdminLogin(false)
                  setError('')
                }}
                className="text-purple-300 text-sm hover:text-white transition"
              >
                ← Back to Spin
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-purple-300 text-xs mt-6">
          © 2024 Sammie Hosty. All rights reserved.
        </p>
      </div>
    </div>
  )
}
