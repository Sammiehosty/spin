# 🎰 Sammie Hosty - Spin & Win Discount App

A spin-to-win discount application for Sammie Hosty's hosting renewal customers.

---

## ✨ Features

### Customer Features
- **Registration Form**: Name and WhatsApp number validation
- **One-time Spin**: Each WhatsApp number can only spin once
- **Discount Wheel**: Win 10%, 15%, 20%, 25%, 30%, or 35% off
- **Balance Calculator**: Shows final price after discount
- **WhatsApp Integration**: One-click claim button to chat with Sammie Hosty

### Admin Features
- **Secure Login**: Username/password protected dashboard
- **Participant List**: View all customers with their details
- **Claim Tracking**: Mark customers who have received their discount
- **Export CSV**: Download participant data
- **Clear All**: Reset the game for new campaigns
- **Real-time Stats**: Track winners, claims, and total savings

---

## 🎮 How It Works

1. **Customer enters details** → Name and WhatsApp number
2. **Validation** → Checks if number hasn't been used before
3. **Spin the wheel** → Random discount selection
4. **View results** → See discount won and balance to pay
5. **Claim discount** → Redirects to WhatsApp with pre-filled message

---

## 💰 Discount Rules

| Item | Value |
|------|-------|
| Original Price | ₦10,000/month |
| Max Winners | 24 (40% of 60 customers) |
| Discount Range | 10% - 35% |
| Special Number | 08012345678 always wins 10% |

### Discount Breakdown
- **10% OFF** → Pay ₦9,000 (Save ₦1,000)
- **15% OFF** → Pay ₦8,500 (Save ₦1,500)
- **20% OFF** → Pay ₦8,000 (Save ₦2,000)
- **25% OFF** → Pay ₦7,500 (Save ₦2,500)
- **30% OFF** → Pay ₦7,000 (Save ₦3,000)
- **35% OFF** → Pay ₦6,500 (Save ₦3,500)

---

## 🔐 Admin Access

### Login Details
- **URL**: `https://yourdomain.com?admin=true`
- **Username**: discord
- **Password**: sammie231991

### Admin Panel Features
1. **Dashboard Stats**
   - Total participants
   - Number of winners
   - Claimed discounts
   - Total savings given

2. **Participant Management**
   - View all entries
   - Mark discounts as claimed
   - Export data to CSV
   - Clear all participants

---

## 📱 WhatsApp Integration

When customers click "Claim Your Discount":
- Opens WhatsApp with pre-filled message
- Message includes: Customer name, WhatsApp number, and discount percentage
- Sends to: **09132733999**

Example message:
```
I won a discount of 20% off my hosting renewal! My name is John and my WhatsApp is 08012345678.
```

---

## 💾 Data Storage

- **localStorage**: Stores participant data in user's browser
- **sessionStorage**: Temporary data during spin session
- **No database required**: Lightweight and fast

---

## 🛡️ Security Features

1. **Obfuscated Credentials**: Admin password is not stored in plain text
2. **WhatsApp Validation**: Prevents duplicate spins
3. **Client-side Storage**: Data stays on user's device
4. **Secure Admin Login**: Additional layer of protection

---

## 📊 Technical Details

### Built With
- React 19
- TypeScript
- Tailwind CSS
- Vite

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## 🔄 Resetting the Game

To allow new customers to spin:
1. Login to admin panel (`?admin=true`)
2. Click "Clear All Participants"
3. Confirm the action
4. Game is reset for new campaign

---

## 📈 Tracking Participants

The admin panel shows:
- Customer name
- WhatsApp number
- Discount won (%)
- Balance to pay (₦)
- Date participated
- Claim status (Pending/Claimed)

---

## 🎨 Customization Options

### Change Winning Number
Edit `src/components/SpinWheel.tsx`:
```typescript
if (user.whatsapp === 'YOUR_NUMBER') {
  return 10  // Always wins this discount
}
```

### Change WhatsApp Number
Edit `src/components/ResultPage.tsx`:
```typescript
const whatsappNumber = '234XXXXXXXXXX'
```

### Adjust Win Probability
Edit `src/components/SpinWheel.tsx`:
```typescript
const maxWinners = 24  // Change this number
```

---

## 📞 Contact

- **Company**: Sammie Hosty
- **WhatsApp**: 09132733999
- **Service**: Website Development & Hosting

---

## 📄 License

© 2024 Sammie Hosty. All Rights Reserved.

---

## 🚀 Quick Start

1. Upload the built files to your hosting
2. Access via your domain
3. Share with customers
4. Monitor in admin panel

**See CPANEL_INSTALLATION_GUIDE.md for detailed setup instructions.**
