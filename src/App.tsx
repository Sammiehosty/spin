import { useState, useEffect } from 'react'
import SpinWheel from './components/SpinWheel'
import RegistrationForm from './components/RegistrationForm'
import AdminPanel from './components/AdminPanel'
import ResultPage from './components/ResultPage'

export interface Participant {
  name: string
  whatsapp: string
  discount: number
  balance: number
  timestamp: number
  claimed: boolean
}

export type PageType = 'register' | 'spin' | 'result' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('register')
  const [currentUser, setCurrentUser] = useState<{ name: string; whatsapp: string } | null>(null)
  const [wonDiscount, setWonDiscount] = useState<number>(0)
  const [wonBalance, setWonBalance] = useState<number>(10000)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('admin') === 'true') {
      setCurrentPage('admin')
    }
  }, [])

  const handleRegistrationComplete = (name: string, whatsapp: string) => {
    setCurrentUser({ name, whatsapp })
    sessionStorage.setItem('current_spin_user', JSON.stringify({ name, whatsapp }))
    setCurrentPage('spin')
  }

  const handleSpinComplete = (discount: number, balance: number) => {
    if (currentUser) {
      const participants: Participant[] = JSON.parse(localStorage.getItem('sammie_participants') || '[]')
      const newParticipant: Participant = {
        name: currentUser.name,
        whatsapp: currentUser.whatsapp,
        discount,
        balance,
        timestamp: Date.now(),
        claimed: false
      }
      participants.push(newParticipant)
      localStorage.setItem('sammie_participants', JSON.stringify(participants))
      
      const usedNumbers: string[] = JSON.parse(localStorage.getItem('sammie_used_numbers') || '[]')
      usedNumbers.push(currentUser.whatsapp)
      localStorage.setItem('sammie_used_numbers', JSON.stringify(usedNumbers))
    }
    setWonDiscount(discount)
    setWonBalance(balance)
    setCurrentPage('result')
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
    setCurrentPage('admin')
  }

  const handleBackToHome = () => {
    setCurrentUser(null)
    setWonDiscount(0)
    setWonBalance(10000)
    setIsAdmin(false)
    setCurrentPage('register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {currentPage === 'register' && (
        <RegistrationForm onComplete={handleRegistrationComplete} onAdminClick={() => setCurrentPage('admin')} />
      )}
      {currentPage === 'spin' && currentUser && (
        <SpinWheel 
          userName={currentUser.name} 
          onSpinComplete={handleSpinComplete}
          onBack={handleBackToHome}
        />
      )}
      {currentPage === 'result' && currentUser && (
        <ResultPage 
          userName={currentUser.name}
          whatsapp={currentUser.whatsapp}
          discount={wonDiscount}
          balance={wonBalance}
          onBackToHome={handleBackToHome}
        />
      )}
      {currentPage === 'admin' && (
        <AdminPanel 
          isLoggedIn={isAdmin}
          onLogin={handleAdminLogin}
          onBack={handleBackToHome}
        />
      )}
    </div>
  )
}

export default App
