interface ResultPageProps {
  userName: string
  whatsapp: string
  discount: number
  onBackToHome: () => void
}

export default function ResultPage({ userName, whatsapp, discount, onBackToHome }: ResultPageProps) {
  const originalPrice = 10000
  const discountAmount = (originalPrice * discount) / 100
  const finalPrice = originalPrice - discountAmount

  const handleClaimDiscount = () => {
    const message = discount > 0 
      ? `I won a discount of ${discount}% off my hosting renewal! My name is ${userName} and my WhatsApp is ${whatsapp}.`
      : `Hi, I participated in the spin game. My name is ${userName} and my WhatsApp is ${whatsapp}.`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = '2349132733999' // Nigerian format (removed leading 0)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {discount > 0 ? (
          // Winner View
          <div className="text-center">
            {/* Celebration Animation */}
            <div className="mb-6">
              <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
            </div>

            {/* Congratulations Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-2xl p-1 mb-6">
              <div className="bg-purple-900 rounded-xl p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                  CONGRATULATIONS!
                </h1>
                <p className="text-white text-lg">You won, {userName}!</p>
              </div>
            </div>

            {/* Discount Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
              <div className="text-center mb-4">
                <span className="text-6xl font-bold text-yellow-400">{discount}%</span>
                <p className="text-white text-xl mt-2">DISCOUNT WON!</p>
              </div>

              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Original Price:</span>
                  <span className="text-white line-through">₦{originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400">Discount ({discount}%):</span>
                  <span className="text-green-400">-₦{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-white font-bold text-lg">You Pay:</span>
                  <span className="text-yellow-400 font-bold text-2xl">₦{finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="bg-green-500/20 border border-green-400 rounded-xl p-4 mb-6">
              <p className="text-green-300 font-semibold">
                💰 You're saving ₦{discountAmount.toLocaleString()}!
              </p>
            </div>

            {/* Claim Button */}
            <button
              onClick={handleClaimDiscount}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-xl shadow-lg hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 mb-4"
            >
              🎁 Claim Your Discount
            </button>

            <p className="text-gray-400 text-sm mb-4">
              Click to chat with Sammie Hosty on WhatsApp
            </p>

            {/* Ref Info */}
            <div className="bg-white/5 rounded-xl p-4 text-left">
              <p className="text-gray-400 text-xs mb-1">Reference Details:</p>
              <p className="text-white text-sm">Name: {userName}</p>
              <p className="text-white text-sm">WhatsApp: {whatsapp}</p>
              <p className="text-white text-sm">Discount: {discount}%</p>
            </div>
          </div>
        ) : (
          // No Win View
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl md:text-8xl">😢</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Better Luck Next Time!
              </h1>
              <p className="text-gray-300 mb-4">
                Sorry {userName}, you didn't win a discount this time.
              </p>
              <p className="text-purple-200 text-sm">
                Don't worry! You can still renew your hosting at the regular price.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-gray-300 mb-2">Regular Renewal Price:</p>
              <span className="text-yellow-400 font-bold text-3xl">₦{originalPrice.toLocaleString()}</span>
              <p className="text-gray-400 text-sm mt-2">per month</p>
            </div>

            <button
              onClick={handleClaimDiscount}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 mb-4"
            >
              💬 Contact Sammie Hosty
            </button>

            <p className="text-gray-400 text-sm mb-4">
              Renew your hosting at standard rates
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="w-full mt-4 py-3 text-purple-300 hover:text-white transition text-sm border border-white/20 rounded-xl hover:bg-white/10"
        >
          ← Back to Home
        </button>

        <p className="text-center text-purple-300 text-xs mt-6">
          © 2024 Sammie Hosty. All rights reserved.
        </p>
      </div>
    </div>
  )
}
