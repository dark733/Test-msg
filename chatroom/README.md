# 🚀 Enhanced Secure Chatroom

A beautiful, feature-rich, real-time chatroom application built with Node.js, Socket.io, and iMessage-inspired design. Perfect for private conversations with end-to-end encryption.

## ✨ Features

### 🔐 Security & Privacy
- **End-to-end encryption** using AES encryption
- **Temporary message storage** - messages are deleted when server restarts
- **Secret key authentication** - only users with the correct key can join
- **Rate limiting** to prevent spam
- **Input sanitization** to prevent XSS attacks

### 💬 Messaging
- **Real-time messaging** with Socket.io
- **Typing indicators** with animated dots
- **Message reactions** (❤️😂👍😮😢😡) with emoji picker
- **Message timestamps** shown on hover
- **System notifications** for user join/leave events
- **Message history** preserved during session

### 📁 File Sharing
- **File upload support** for images, videos, audio, and documents
- **Image preview** with full-screen modal view
- **File type icons** for different document types
- **Drag & drop** file upload support
- **10MB file size limit** with progress feedback

### 🎨 User Experience
- **iMessage-style design** with smooth animations
- **Dark/Light theme toggle** with persistent preference
- **Responsive design** optimized for mobile and desktop
- **Connection status indicator** with visual feedback
- **Sound notifications** for new messages (toggleable)
- **Browser notifications** when tab is inactive
- **Smooth animations** and transitions throughout

### 🔧 Technical Features
- **Auto-reconnection** on connection loss
- **Activity tracking** to detect inactive users
- **Error handling** with user-friendly messages
- **Keyboard shortcuts** (Ctrl+Enter to send, Escape to close modals)
- **Offline detection** with status updates

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   cd chatroom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Or access via your local network IP for mobile devices

### For Public Access (Optional)

To make your chatroom accessible from the internet, you can use ngrok:

1. **Install ngrok** (download from https://ngrok.com/)

2. **Expose your local server**
   ```bash
   ngrok http 3000
   ```

3. **Share the provided URL** with your fiancée

## 🎯 Usage Guide

### Getting Started
1. **Enter a username** (max 20 characters)
2. **Create a secret key** - share this privately with your fiancée
3. **Click "Join Chat"** to enter the chatroom

### Messaging
- **Type and press Enter** to send messages
- **Double-click messages** to add reactions
- **Use Ctrl+Enter** as an alternative send shortcut
- **See typing indicators** when the other person is typing

### File Sharing
- **Click the paperclip button** (📎) to select files
- **Drag and drop** files directly into the chat area
- **Preview images** by clicking on them for full-screen view
- **Download files** by clicking on file attachments

### Customization
- **Toggle dark/light mode** using the moon/sun button
- **Sound notifications** can be managed through browser settings
- **Browser notifications** - allow when prompted for best experience

### Keyboard Shortcuts
- `Enter` - Send message
- `Ctrl+Enter` - Send message (alternative)
- `Escape` - Close modals and reaction pickers
- `Double-click message` - Show reaction picker

## 🏗️ Technical Architecture

### Backend (server.js)
- **Express.js** web server
- **Socket.io** for real-time communication
- **Multer** for file upload handling
- **In-memory storage** for temporary data
- **Rate limiting** and security measures

### Frontend (index.html)
- **Vanilla JavaScript** for maximum performance
- **CSS custom properties** for theming
- **Socket.io client** for real-time updates
- **CryptoJS** for message encryption
- **Responsive design** with CSS Grid and Flexbox

### File Structure
```
chatroom/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── public/
│   └── index.html    # Frontend application
├── uploads/          # Temporary file storage (auto-created)
└── README.md         # This file
```

## 🔒 Security Features

### Encryption
- Messages are encrypted client-side using AES encryption
- Only users with the correct secret key can decrypt messages
- Encryption keys are never stored on the server

### Data Protection
- No message persistence beyond server session
- Files are temporarily stored and can be manually cleaned
- User data is not logged or stored permanently

### Best Practices
- Use strong, unique secret keys
- Don't share secret keys through insecure channels
- Regularly restart the server to clear temporary data

## 🚀 Deployment Options

### Local Network
Perfect for home use - both devices connect to the same WiFi network.

### Cloud Hosting
Deploy to platforms like:
- **Heroku** (free tier available)
- **Railway** (modern deployment platform)
- **DigitalOcean App Platform**
- **AWS EC2** (for advanced users)

### Tunnel Services
For quick sharing:
- **ngrok** - easiest option
- **LocalTunnel** - free alternative
- **Serveo** - SSH-based tunnel

## 🎨 Customization

### Changing the App Name
Edit the `chatHeader.innerHTML` in the JavaScript section:
```javascript
chatHeader.innerHTML = `Your Custom Name <span class="connection-status" id="connectionStatus"></span>`;
```

### Custom Colors
Modify the CSS custom properties in the `:root` section:
```css
:root {
    --imessage-blue: #007aff;  /* Change primary color */
    --background-color: #ffffff;
    /* ... other colors */
}
```

### File Upload Limits
Adjust in `server.js`:
```javascript
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // Change file size limit
    },
    // ... other options
});
```

## 🐛 Troubleshooting

### Common Issues

**Can't connect to server**
- Ensure the server is running (`npm start`)
- Check if port 3000 is available
- Verify firewall settings

**Messages not encrypting/decrypting**
- Ensure both users have the exact same secret key
- Check browser console for encryption errors
- Try refreshing the page

**File upload not working**
- Check file size (must be under 10MB)
- Ensure file type is supported
- Verify server has write permissions for uploads folder

**Mobile layout issues**
- Clear browser cache
- Try refreshing the page
- Ensure you're using a modern browser

### Browser Compatibility
- **Chrome/Edge** - Full support
- **Firefox** - Full support  
- **Safari** - Full support
- **Mobile browsers** - Optimized for touch

### Performance Tips
- Restart server periodically to clear memory
- Close unused browser tabs
- Use wired connection for best performance

## 📱 Mobile Features

- **Touch-optimized interface**
- **Responsive design** that adapts to screen size
- **Mobile keyboard** optimized input
- **Touch gestures** for file upload and reactions
- **Native app-like experience**

## 🎉 What's New in This Version

This enhanced version includes many improvements over a basic chatroom:

### New Features Added
- ✅ Message reactions with emoji picker
- ✅ File sharing with preview
- ✅ Dark/light theme toggle
- ✅ Enhanced connection status
- ✅ Improved error handling
- ✅ Sound notifications
- ✅ Typing indicators with animations
- ✅ Message history during session
- ✅ Drag & drop file upload
- ✅ Keyboard shortcuts
- ✅ Activity tracking
- ✅ Rate limiting
- ✅ Image modal viewer
- ✅ Responsive mobile design
- ✅ Offline detection

## 💝 Perfect for Couples

This chatroom is designed with couples in mind:
- **Private and secure** - only you two can join
- **Beautiful iMessage-style design** - familiar and elegant
- **Share photos and files easily** - perfect for sending memes, photos, and documents
- **Dark mode** for late-night conversations
- **Mobile-optimized** - chat from anywhere
- **No data collection** - your conversations stay between you two

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Restart the server and refresh browsers
3. Ensure both users are using the same secret key
4. Check browser console for error messages

## 🎊 Enjoy Your Private Chatroom!

Have fun chatting with your fiancée in this beautiful, secure, and feature-rich chatroom! The temporary nature ensures your private conversations stay private, while the rich features make communication fun and engaging.

---

*Built with ❤️ for private, secure, and beautiful communication.*