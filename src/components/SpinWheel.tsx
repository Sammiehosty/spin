import { useState, useEffect, useRef } from 'react'

// ============================================
// ⚙️ CONFIGURATION - CHANGE THESE VALUES
// ============================================
const TOTAL_CUSTOMERS = 100        // 👈 CHANGE THIS: Total number of customers (e.g., 60, 100, 200)
const DISCOUNT_PERCENTAGE = 40     // 👈 CHANGE THIS: Percentage of customers who can win (e.g., 40 = 40%)
const MONTHLY_FEE = 10000          // 👈 CHANGE THIS: Monthly maintenance fee in Naira
// ============================================

const MAX_WINNERS = Math.floor(TOTAL_CUSTOMERS * (DISCOUNT_PERCENTAGE / 100))

interface SpinWheelProps {
  userName: string
  onSpinComplete: (discount: number, balance: number) => void
  onBack: () => void
}

const SEGMENTS = [
  { label: '10% OFF', value: 10, color: '#FF6B6B' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
  { label: '15% OFF', value: 15, color: '#4ECDC4' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
  { label: '20% OFF', value: 20, color: '#45B7D1' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
  { label: '25% OFF', value: 25, color: '#96CEB4' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
  { label: '30% OFF', value: 30, color: '#FFEAA7' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
  { label: '35% OFF', value: 35, color: '#DDA0DD' },
  { label: 'NO WIN', value: 0, color: '#4A5568' },
]

export default function SpinWheel({ userName, onSpinComplete, onBack }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const getWinningDiscount = (): number => {
    const participants: Array<{ whatsapp: string; discount: number }> = JSON.parse(
      localStorage.getItem('sammie_participants') || '[]'
    )
    
    // Special case: 08012345678 always wins 10%
    // Get the current user's WhatsApp from session
    const sessionData = sessionStorage.getItem('current_spin_user')
    if (sessionData) {
      const user = JSON.parse(sessionData)
      if (user.whatsapp === '08012345678') {
        return 10
      }
    }

    // Count winners so far
    const winnersCount = participants.filter(p => p.discount > 0).length

    // If we've already given out all discounts, return 0
    if (winnersCount >= MAX_WINNERS) {
      return 0
    }

    // Calculate probability based on remaining slots
    const remainingSlots = TOTAL_CUSTOMERS - participants.length
    const remainingWinners = MAX_WINNERS - winnersCount
    
    // Probability of winning
    const winProbability = remainingWinners / remainingSlots
    
    // Random check if this spin wins
    if (Math.random() > winProbability) {
      return 0
    }

    // If they win, randomly select a discount
    const discounts = [10, 15, 20, 25, 30, 35]
    const weights = [30, 25, 20, 12, 8, 5] // Higher chance for lower discounts
    
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return discounts[i]
      }
    }
    
    return discounts[0]
  }

  const spin = () => {
    if (isSpinning || hasStarted) return
    
    setHasStarted(true)
    setIsSpinning(true)
    
    const winningDiscount = getWinningDiscount()
    
    // Find a segment with the winning discount
    const matchingSegments = SEGMENTS.map((seg, idx) => ({ ...seg, idx }))
      .filter(seg => seg.value === winningDiscount)
    
    const targetSegment = matchingSegments[Math.floor(Math.random() * matchingSegments.length)]
    
    // Calculate rotation
    const segmentAngle = 360 / SEGMENTS.length
    const targetAngle = targetSegment.idx * segmentAngle + segmentAngle / 2
    
    // Multiple full rotations + target position (pointer is at top, so we need to adjust)
    const fullRotations = 5 + Math.floor(Math.random() * 3) // 5-7 full rotations
    const finalRotation = fullRotations * 360 + (360 - targetAngle) - rotation
    
    setRotation(prev => prev + finalRotation)
    
    // Complete after animation
    setTimeout(() => {
      setIsSpinning(false)
      const balance = MONTHLY_FEE - (MONTHLY_FEE * winningDiscount / 100)
      onSpinComplete(winningDiscount, balance)
    }, 5000)
  }

  useEffect(() => {
    // Store current user in session for WhatsApp check
    const storedUser = sessionStorage.getItem('current_spin_user')
    if (!storedUser) {
      // User data should be passed from registration
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">🎰 Spin the Wheel!</h1>
        <p className="text-purple-200">Good luck, <span className="text-yellow-400 font-semibold">{userName}</span>!</p>
      </div>

      {/* Wheel Container */}
      <div className="relative mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg"></div>
        </div>

        {/* Outer ring */}
        <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 p-2 shadow-2xl">
          {/* Wheel */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {SEGMENTS.map((segment, index) => {
              const angle = 360 / SEGMENTS.length
              const rotate = index * angle
              
              return (
                <div
                  key={index}
                  className="absolute w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    transform: `rotate(${rotate}deg) skewY(-${90 - angle}deg)`,
                    backgroundColor: segment.color,
                    right: '50%',
                    top: '0',
                  }}
                >
                  <span
                    className="absolute text-white text-xs font-bold whitespace-nowrap"
                    style={{
                      transform: `skewY(${90 - angle}deg) rotate(${angle / 2}deg)`,
                      left: '60%',
                      top: '40%',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {segment.label}
                  </span>
                </div>
              )
            })}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      {!hasStarted ? (
        <button
          onClick={spin}
          disabled={isSpinning}
          className="px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎲 SPIN NOW!
        </button>
      ) : (
        <div className="text-center">
          <div className="animate-pulse text-white text-xl font-semibold">
            {isSpinning ? '🎡 Spinning...' : '✨ Processing...'}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 text-center max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <p className="text-purple-200 text-sm">
            🎁 Win discounts from <span className="text-yellow-400 font-bold">10% to 35%</span> off your hosting renewal!
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Regular price: ₦10,000/month
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-6 text-purple-300 hover:text-white transition text-sm"
      >
        ← Back to Home
      </button>
    </div>
  )
}
