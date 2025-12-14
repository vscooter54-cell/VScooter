# ngrok Setup for Client Demo

## Step 1: Setup ngrok (First time only)

1. Sign up at: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run (replace YOUR_TOKEN):
```bash
./ngrok.exe config add-authtoken YOUR_TOKEN
```

## Step 2: Start ngrok tunnels

Open **TWO** command prompts/terminals:

### Terminal 1 - Backend
```bash
cd D:\Work\VScooter
./ngrok.exe http 5000
```
**Copy the HTTPS URL** (e.g., `https://abc-123-xyz.ngrok-free.app`)

### Terminal 2 - Frontend
```bash
cd D:\Work\VScooter
./ngrok.exe http 5173
```
**Copy the HTTPS URL** (e.g., `https://def-456-abc.ngrok-free.app`)

---

## Step 3: Update environment files

### Update `vscooter-backend\.env`
Replace the FRONTEND_URL line with your frontend ngrok URL:
```env
FRONTEND_URL=https://def-456-abc.ngrok-free.app
```

### Update `vscooter-react\.env`
Replace the VITE_API_URL with your backend ngrok URL:
```env
VITE_API_URL=https://abc-123-xyz.ngrok-free.app/api
```

---

## Step 4: Start your servers

### Terminal 3 - Start Backend
```bash
cd vscooter-backend
npm start
```

### Terminal 4 - Start Frontend
```bash
cd vscooter-react
npm run dev
```

---

## Step 5: Share with client

Send your client the **FRONTEND ngrok URL**:
```
https://def-456-abc.ngrok-free.app
```

They can open it in their browser and use the site!

---

## Notes:
- ✅ Your MongoDB Atlas is already configured
- ✅ ngrok URLs change each time you restart ngrok (free version)
- ✅ Keep all 4 terminals/windows open while client is viewing
- ✅ ngrok free tier has a session limit, so plan your demo accordingly

## Troubleshooting:
- If you see CORS errors: double-check the FRONTEND_URL in backend .env matches your frontend ngrok URL exactly
- If API calls fail: verify VITE_API_URL in frontend .env matches your backend ngrok URL exactly (with /api at the end)
