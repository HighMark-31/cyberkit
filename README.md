# CyberKit

<div align="center">

**🛡️ Open-Source Cybersecurity Toolkit for Security Professionals & Developers**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0-green.svg)](releases)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/UI%20Framework-React-61DAFB?logo=react)](https://react.dev/)

[Live Demo](https://cyberkit.highmark.it) • [Documentation](#-documentation) • [Features](#-key-features) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## 📋 About

CyberKit is a modern, intuitive cybersecurity toolkit suite providing essential utilities for security professionals, penetration testers, developers, and IT enthusiasts. Whether you're analyzing security headers, cracking hashes, detecting vulnerabilities, or testing network connectivity, CyberKit delivers a unified platform with a beautiful, responsive UI.

**Built for:** Security testing • Penetration testing • Security education • DevOps workflows • Network diagnostics

---

## ✨ Key Features

### 🔧 Security Tools

- **Encoder/Decoder** — Convert between Base64, URL encoding, Hex, and more formats
- **Hash Generator** — Generate hashes (MD5, SHA-1, SHA-256, SHA-512, Blake3, etc.)
- **Password Checker** — Evaluate password strength with detailed feedback
- **Password Generator** — Create cryptographically secure random passwords
- **XSS Detector** — Identify potential Cross-Site Scripting vulnerabilities
- **SSL/TLS Checker** — Analyze SSL certificates and TLS configurations
- **HTTP Header Analyzer** — Identify security misconfigurations and vulnerabilities
- **Log Analyzer** — Parse and analyze log files for security events

### 🌐 Network Tools

- **Ping** — Test network connectivity and latency
- **Traceroute** — Trace packet routes across networks
- **Whois** — Retrieve domain and IP registration information

### 💡 User Experience

- ⚡ **Lightning-fast performance** with Vite + React
- 📱 **Fully responsive design** — Works on desktop, tablet, and mobile
- 🎨 **Modern UI** with intuitive navigation
- 🔄 **Real-time results** for immediate feedback
- 📋 **Copy-to-clipboard** for all outputs
- 🌙 **Dark mode support** (modern interface)

---

## 🚀 Getting Started

### Quick Demo

Try CyberKit online: **[cyberkit.highmark.it](https://cyberkit.highmark.it)**

### Local Installation

**Prerequisites:**
- Node.js 16+ (or Bun 1.0+)
- npm, yarn, or Bun package manager

**Step 1: Clone the repository**

```bash
git clone https://github.com/HighMark-31/cyberkit.git
cd cyberkit
```

**Step 2: Install dependencies**

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using Bun (fastest)
bun install
```

**Step 3: Start development server**

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev

# OR using Bun
bun run dev
```

The app will be available at `http://localhost:5173` (or similar port shown in terminal)

**Step 4: Build for production**

```bash
npm run build    # Creates optimized build in 'dist/'
npm run preview  # Preview production build locally
```

---

## 📖 Usage

1. **Open the application** in your browser (local or [live demo](https://cyberkit.highmark.it))
2. **Select a tool** from the sidebar navigation
3. **Input your data** in the designated fields
4. **View results instantly** with formatted output
5. **Copy results** with the built-in copy button

### Example Workflows

**Generate a Secure Password:**
- Navigate to `Password Generator`
- Customize length and character types
- Click generate and copy to clipboard

**Analyze HTTP Headers:**
- Go to `HTTP Header Analyzer`
- Paste headers from your browser DevTools
- Get security recommendations

**Check SSL Certificate:**
- Open `SSL Checker`
- Enter domain name
- View certificate details and expiration

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|----------|
| **TypeScript** | Type-safe JavaScript | Latest |
| **React** | UI Framework | 19+ |
| **Vite** | Build tool & dev server | 5+ |
| **Tailwind CSS** | Styling | 3+ |
| **Node.js** | Runtime | 16+ |

---

## 📁 Project Structure

```
cyberkit/
├── src/
│   ├── components/     # React components for each tool
│   ├── lib/           # Utility functions and logic
│   ├── App.tsx        # Main application
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── package.json       # Dependencies
└── vite.config.ts     # Vite configuration
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

### Fork & Clone

```bash
git clone https://github.com/YOUR-USERNAME/cyberkit.git
cd cyberkit
```

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Make Your Changes

- Add new tools or improve existing ones
- Update tests if applicable
- Follow the existing code style

### Commit & Push

```bash
git add .
git commit -m "feat: add new security tool"
git push origin feature/your-feature-name
```

### Open a Pull Request

Go to GitHub and create a PR with a clear description of your changes.

### Development Checklist

- ✅ Code follows TypeScript best practices
- ✅ Components are properly documented
- ✅ Responsive design verified
- ✅ No console errors or warnings
- ✅ Tested on multiple browsers

---

## 🐛 Issue Template

When reporting bugs, please include:

- Browser and OS information
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable

---

## 📝 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it for personal and commercial projects.

---

## 💬 Support & Contact

- **Issues & Suggestions:** [GitHub Issues](https://github.com/HighMark-31/cyberkit/issues)
- **Website:** [highmark.it](https://highmark.it)
- **GitHub:** [@HighMark-31](https://github.com/HighMark-31)

---

## ⭐ Show Your Support

If CyberKit helped you or you find it useful, please consider:

1. **Starring** this repository ⭐
2. **Sharing** it with your security-focused friends
3. **Contributing** improvements and new tools

---

## 📊 Status

- ✅ v1.0 Released
- 🔄 Active development & improvements
- 📦 Ready for production use

---

<div align="center">

**Made with ❤️ by [HighMark](https://github.com/HighMark-31) | MIT License**

</div>
