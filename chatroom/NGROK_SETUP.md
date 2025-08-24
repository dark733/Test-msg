# 🌐 ngrok Setup Guide for Secure Chatroom

This guide will help you set up ngrok to make your chatroom accessible to your fiancée from anywhere in the world.

## 📋 Table of Contents

- [What is ngrok?](#what-is-ngrok)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Sharing with Your Fiancée](#sharing-with-your-fiancée)
- [Testing Connection](#testing-connection)
- [Troubleshooting](#troubleshooting)
- [Security Tips](#security-tips)
- [Alternative Solutions](#alternative-solutions)

## 🤔 What is ngrok?

ngrok creates a secure tunnel from a public URL to your local server, allowing anyone on the internet to access your chatroom. It's perfect for:

- **Remote Access**: Your fiancée can join from anywhere
- **Easy Setup**: No router configuration needed
- **Secure**: Uses HTTPS encryption
- **Temporary**: URLs expire when you stop ngrok (perfect for privacy)

## ⚡ Quick Start

1. **Install ngrok**:
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager:
   brew install ngrok/ngrok/ngrok  # macOS
   choco install ngrok             # Windows
   sudo snap install ngrok         # Linux
   ```

2. **Start your chatroom**:
   ```bash
   cd chatroom
   npm start
   ```

3. **Start ngrok** (in a new terminal):
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (looks like `https://abc123.ngrok.io`) and share it with your fiancée!

## 🔧 Detailed Setup

### Step 1: Install ngrok

#### Option A: Download from Website
1. Go to [https://ngrok.com/download](https://ngrok.com/download)
2. Download the version for your operating system
3. Extract the file and move it to a folder in your PATH

#### Option B: Package Manager
```bash
# macOS with Homebrew
brew install ngrok/ngrok/ngrok

# Windows with Chocolatey
choco install ngrok

# Linux with Snap
sudo snap install ngrok

# Or using npm globally
npm install -g ngrok
```

### Step 2: Create ngrok Account (Optional but Recommended)

1. Sign up at [https://ngrok.com](https://ngrok.com)
2. Get your auth token from the dashboard
3. Connect your account:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

**Benefits of signing up**:
- Longer session duration
- Custom subdomain names
- More concurrent tunnels
- Connection statistics

### Step 3: Start Your Chatroom Server

```bash
cd chatroom
npm start
```

You should see:
```
🚀 Secure chatroom server running on port 3000
📱 Local access: http://localhost:3000
🌐 Network access: http://0.0.0.0:3000
📡 For ngrok: ngrok http 3000
```

### Step 4: Start ngrok Tunnel

Open a **new terminal window** and run:

```bash
ngrok http 3000
```

You'll see output like:
```
ngrok by @inconshreveable

Session Status                online
Account                       your-email@example.com
Version                       3.1.0
Region                        United States (us)
Forwarding                    https://abc123def.ngrok.io -> http://localhost:3000
Forwarding                    http://abc123def.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Important**: Always use the **HTTPS URL** (e.g., `https://abc123def.ngrok.io`)

### Step 5: Test the Connection

1. Open the ngrok HTTPS URL in your browser
2. You should see your chatroom login page
3. Try connecting with a test username and secret key

## 💕 Sharing with Your Fiancée

### What to Share

Send your fiancée:

1. **The ngrok HTTPS URL**: `https://abc123def.ngrok.io`
2. **The secret key**: The same password you both agreed on
3. **Instructions**: "Go to this URL, enter your username and our secret key"

### Example Message

```
Hey babe! 💕

I've set up our private chatroom! Here's how to join:

🔗 URL: https://abc123def.ngrok.io
🔐 Secret Key: OurSpecialKey123
👤 Username: Choose any name you want

Just click the link, enter a username and our secret key, then click "Join Secure Chat"

The chat has privacy protection - it will detect screenshots and notify us both! 😉

Love you! ❤️
```

## 🧪 Testing Connection

### Use the Built-in Test Page

1. Go to `https://your-ngrok-url.ngrok.io/test.html`
2. This shows connection diagnostics and helps identify issues
3. Try connecting with test credentials
4. Check the debug log for any errors

### Manual Testing Steps

1. **Both users access the same ngrok URL**
2. **Use the same secret key**
3. **Choose different usernames**
4. **Test sending messages back and forth**
5. **Try uploading a file**
6. **Test reactions by double-clicking messages**

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "Connection Failed" or "Network Error"

**Causes:**
- Server not running
- Wrong ngrok URL
- Firewall blocking connection

**Solutions:**
```bash
# 1. Check if server is running
curl http://localhost:3000

# 2. Restart server
npm start

# 3. Restart ngrok
ngrok http 3000

# 4. Check if port is in use
lsof -i :3000  # macOS/Linux
netstat -an | grep 3000  # Windows
```

#### ❌ "Username Already Taken"

**Cause:** Someone is already using that username in the room

**Solutions:**
- Try a different username
- Wait a few minutes for old connections to expire
- Restart the server to clear all connections

#### ❌ "Could Not Decrypt Message"

**Cause:** Different secret keys being used

**Solutions:**
- Ensure both users have the exact same secret key
- Check for extra spaces or different capitalization
- Share the secret key through a secure channel

#### ❌ Messages Not Appearing

**Causes:**
- Connection issues
- JavaScript errors
- Encryption problems

**Solutions:**
```bash
# 1. Check browser console for errors (F12)
# 2. Try the test page: /test.html
# 3. Restart browsers
# 4. Clear browser cache
```

#### ❌ ngrok Tunnel Expired

**Cause:** Free ngrok tunnels expire after 8 hours

**Solutions:**
- Restart ngrok (you'll get a new URL)
- Sign up for ngrok account for longer sessions
- Use a custom domain (paid feature)

### Advanced Debugging

#### Check Server Logs

Your server shows detailed connection information:
```
📊 Active rooms: 1, Total users: 2
User connected: abc123
jdoe joined room: secretkey123
Message received from jdoe: Hello world
```

#### Browser Developer Tools

Press F12 and check:
- **Console**: Look for JavaScript errors
- **Network**: Check if requests are failing
- **Application > Local Storage**: Check saved preferences

#### Test Page Diagnostics

Use `/test.html` to:
- Test socket.io connection
- Send test messages
- View detailed debug logs
- Check connection statistics

## 🔒 Security Tips

### For Maximum Privacy

1. **Use Strong Secret Keys**:
   ```
   Good: MyFiance2024SecretChat!
   Bad: 123 or password
   ```

2. **Don't Share URLs Publicly**:
   - Only share with your fiancée
   - Use private messaging (Signal, WhatsApp, etc.)

3. **Temporary URLs**:
   - ngrok URLs change each session
   - Messages are automatically deleted when server restarts

4. **Monitor Connections**:
   - Check "Online" user list
   - Watch for privacy alerts
   - Restart if you see unknown users

### ngrok Security Features

- **HTTPS Encryption**: All traffic is encrypted
- **Temporary URLs**: Links expire when tunnel stops
- **Access Logs**: See who connects in ngrok dashboard
- **Password Protection**: Add basic auth (paid feature)

## 🌟 Alternative Solutions

### If ngrok Doesn't Work

#### 1. **LocalTunnel** (Free Alternative)
```bash
# Install
npm install -g localtunnel

# Start server
npm start

# Create tunnel
lt --port 3000
```

#### 2. **Serveo** (SSH-based)
```bash
# Start server
npm start

# Create tunnel
ssh -R 80:localhost:3000 serveo.net
```

#### 3. **Port Forwarding** (Router Setup)
- Forward port 3000 on your router
- Share your public IP address
- More technical but permanent

#### 4. **Cloud Hosting** (Permanent Solution)
- Deploy to Heroku, Railway, or DigitalOcean
- Get a permanent URL
- Better for regular use

### Quick Cloud Deploy Commands

```bash
# Heroku (requires Heroku CLI)
git init
heroku create your-chatroom-name
git add .
git commit -m "Initial commit"
git push heroku main

# Railway (requires Railway CLI)
railway login
railway init
railway up
```

## 📞 Support

### If You're Still Having Issues

1. **Check the test page**: `your-url.ngrok.io/test.html`
2. **Look at server console** for error messages
3. **Check browser developer tools** (F12)
4. **Try different browsers** (Chrome, Firefox, Safari)
5. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   # Stop ngrok (Ctrl+C)
   npm start        # Start server
   ngrok http 3000  # Start tunnel in new terminal
   ```

### Emergency Backup Plan

If ngrok fails completely:

1. **Both users on same WiFi**: Use local IP address
2. **Mobile hotspot**: Connect both devices to same hotspot
3. **Video call setup**: Screen share to help troubleshoot
4. **Alternative apps**: Signal, WhatsApp, Telegram as backup

## 🎉 Success Checklist

- [ ] ngrok tunnel running (`https://` URL working)
- [ ] Server running on port 3000
- [ ] Both users can access the same URL
- [ ] Both users using same secret key
- [ ] Messages sending and receiving
- [ ] File uploads working
- [ ] Privacy alerts functioning
- [ ] Reactions working (double-click messages)

**You're ready to chat securely with your fiancée! 💕**

---

*Need help? The test page at `/test.html` has connection diagnostics and troubleshooting tools.*