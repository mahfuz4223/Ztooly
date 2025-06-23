# 🚀 Ztooly - The Ultimate Free Online Tool Collection

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ztooly.com-4285f4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ztooly.com)
[![License: MIT](https://img.shields.io/badge/📄_License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/⚡_Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/⚛️_React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/🔷_TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/🤝_PRs-Welcome-ff69b4.svg?style=for-the-badge)](http://makeapullrequest.com)

**Ztooly** is a comprehensive collection of **50+ free online tools** designed to boost productivity and simplify everyday tasks. From AI-powered generators to image processing, data conversion to developer utilities - Ztooly provides everything you need in one intuitive platform.

> 🎯 **Mission**: Empowering users with powerful, free tools while maintaining privacy and performance.

## ⭐ Why Choose Ztooly?

- 🆓 **100% Free** - No hidden costs, no premium tiers
- 🔒 **Privacy First** - Files processed locally when possible
- ⚡ **Lightning Fast** - Optimized for speed and performance
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean, intuitive interface
- 🔧 **Developer Friendly** - Open source and extensible

## �️ Complete Tool Collection

### 🤖 AI-Powered Tools
- **AI Headline Generator** - Create catchy headlines for articles and marketing
- **AI Image Caption Generator** - Generate descriptive captions for images
- **Social Media Bio Generator** - Craft engaging social media biographies
- **YouTube Title Generator** - Create compelling video titles
- **Video Script Hook Generator** - Generate engaging video opening hooks
- **Hashtag Generator** - Generate trending hashtags for social media

### 🖼️ Image Processing Tools
- **Background Remover** - Remove backgrounds from images instantly using AI
- **Image Resizer** - Resize images to any dimensions while maintaining quality
- **Image Watermarker** - Add custom watermarks to protect your images
- **Image EXIF Remover** - Strip metadata and location data from photos
- **Code Snippet to Image** - Convert code blocks into beautiful shareable images

### 📄 PDF Tools
- **PDF Merger** - Combine multiple PDF files into one document
- **PDF Compressor** - Reduce PDF file sizes without quality loss
- **PDF to Word** - Convert PDF documents to editable Word files
- **PDF to Image** - Extract pages from PDFs as image files
- **PDF Password Protection** - Secure PDFs with password encryption

### � Data Conversion Tools
- **CSV to JSON Converter** - Transform CSV data into JSON format
- **JSON Tools** - Format, validate, minify, and beautify JSON data
- **Case Converter** - Convert text between different cases (camelCase, snake_case, etc.)
- **Markdown Previewer** - Real-time markdown preview with syntax highlighting

### 🎨 Design & Color Tools
- **Color Palette Generator** - Create beautiful color schemes and palettes
- **QR Code Generator** - Generate QR codes for URLs, text, and contact info
- **Barcode Generator** - Create various barcode formats (UPC, EAN, Code128, etc.)

### 🔢 Calculators & Math Tools
- **BMI Calculator** - Calculate Body Mass Index with health recommendations
- **Percentage Calculator** - Quick percentage calculations and conversions
- **Loan Repayment Calculator** - Calculate monthly payments and interest

### 🔐 Security & Generator Tools
- **Password Generator** - Create secure passwords with customizable options
- **Lorem Ipsum Generator** - Generate placeholder text in various formats
- **Fake Address Generator** - Generate realistic addresses for testing
- **Fake Credit Card Generator** - Create test credit card numbers for development
- **Fake User Profile Generator** - Generate realistic user profiles with avatars
- **Fake IBAN Generator** - Generate valid IBAN numbers for testing

### 📱 Social Media Tools
- **Tweet to Image Converter** - Convert tweets into shareable images
- **Fake Tweet Generator** - Create mock tweets for design mockups
- **Fake Facebook Post Generator** - Generate fake Facebook posts for demos
- **Instagram Profile Viewer** - View Instagram profiles and posts
- **YouTube Tag Extractor** - Extract tags from YouTube videos
- **YouTube Thumbnail Grabber** - Download video thumbnails in various sizes

### 🌐 Web Development Tools
- **URL Scanner** - Analyze URLs for safety and get detailed information
- **Reading Time Estimator** - Calculate estimated reading time for articles

### ⚖️ Legal Document Generators
- **Privacy Policy Generator** - Create GDPR-compliant privacy policies
- **Terms & Conditions Generator** - Generate comprehensive legal terms

### 📊 Analytics & SEO Tools
- **Usage Statistics** - Track and analyze tool usage patterns
- **IP Analytics** - Get detailed information about IP addresses
- **IP Diagnostics** - Comprehensive IP address analysis and geolocation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS
- **Analytics**: Custom analytics service (optional)

## 🚀 Key Features

- **🎨 Modern UI/UX** - Clean, responsive interface built with React and Tailwind CSS
- **⚡ Lightning Fast** - Optimized for speed with Vite build system
- **🔧 50+ Tools** - Comprehensive collection of productivity tools
- **📱 Mobile Responsive** - Works seamlessly across all devices
- **🔒 Privacy Focused** - Files processed locally when possible
- **🛡️ Type Safety** - Full TypeScript support for better development experience
- **🔌 Extensible** - Modular architecture for easy feature additions
- **🌐 SEO Optimized** - Structured data and meta tags for better visibility

## 📦 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ztooly.git
   cd ztooly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_APP_NAME=Ztooly
   VITE_APP_URL=http://localhost:5173
   VITE_ANALYTICS_ENABLED=false
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Start the backend server** (in a new terminal)
   ```bash
   npm run server
   # or
   node server.js
   ```

6. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Setup (Optional)

```bash
# Build Docker image
docker build -t ztooly .

# Run container
docker run -p 3000:3000 ztooly
```

## 🏗️ Project Structure

```
ztooly/
├── public/                     # Static assets
│   ├── favicon.ico            # Site favicon
│   ├── robots.txt             # SEO robots file
│   ├── sitemap.xml            # SEO sitemap
│   └── lovable-uploads/       # User uploaded files
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   ├── FileUpload.tsx    # File upload component
│   │   ├── SiteNav.tsx       # Navigation component
│   │   ├── SiteFooter.tsx    # Footer component
│   │   └── ...               # Other components
│   ├── pages/                # Tool pages
│   │   ├── Index.tsx         # Homepage
│   │   ├── AIImageCaptionGenerator.tsx
│   │   ├── BackgroundRemover.tsx
│   │   ├── PDFTools.tsx      # PDF tools
│   │   └── ...               # 50+ tool pages
│   ├── hooks/                # Custom React hooks
│   │   ├── useAnalytics.ts   # Analytics hook
│   │   └── use-toast.ts      # Toast notifications
│   ├── services/             # API services
│   │   └── analyticsService.ts
│   ├── utils/                # Utility functions
│   │   ├── toolRegistry.ts   # Tool registration
│   │   ├── analyticsHelper.ts
│   │   └── ...               # Helper utilities
│   └── lib/                  # Core libraries
│       └── utils.ts          # Common utilities
├── server.js                 # Express backend server
├── database-schema.sql       # Database structure
├── .env.example             # Environment variables template
├── LICENSE                  # MIT License
└── package.json             # Project configuration
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run server` | Start Express backend server |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Fix linting issues automatically |

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application Configuration
VITE_APP_NAME=Ztooly
VITE_APP_URL=https://ztooly.com

# Analytics (Optional)
VITE_ANALYTICS_ENABLED=true

# Development
NODE_ENV=development
```

### Analytics Setup

Ztooly includes optional analytics to track tool usage:

1. Set `VITE_ANALYTICS_ENABLED=true` in your `.env`
2. Analytics data is stored locally in SQLite
3. No external tracking services are used by default

### Customization

- **Themes**: Modify `tailwind.config.ts` for custom styling
- **Components**: Extend or modify components in `src/components/`
- **Tools**: Add new tools by following the existing patterns in `src/pages/`

## 🧩 How to Add a New Tool

Follow these steps to add a new tool to Ztooly:

1. **Create the tool page**
   ```tsx
   // src/pages/MyNewTool.tsx
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
   import { useAnalytics } from "@/hooks/useAnalytics";

   export default function MyNewTool() {
     const { trackToolUsage } = useAnalytics();

     const handleToolAction = () => {
       trackToolUsage('my-new-tool', 'action_performed');
       // Tool logic here
     };

     return (
       <div className="container mx-auto py-8">
         <Card>
           <CardHeader>
             <CardTitle>My New Tool</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Tool interface here */}
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

2. **Register the tool**
   ```ts
   // Add to src/utils/toolRegistry.ts
   {
     id: 'my-new-tool',
     name: 'My New Tool',
     description: 'Description of what the tool does',
     category: 'category-name',
     icon: 'tool-icon',
     path: '/my-new-tool',
     component: lazy(() => import('@/pages/MyNewTool'))
   }
   ```

3. **Add to navigation** (if needed)
   ```tsx
   // Update src/components/SiteNav.tsx
   ```

4. **Update routing**
   ```tsx
   // Add route to your routing configuration
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Import project to Vercel
3. Set environment variables
4. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### CloudLinux cPanel with NodeJS Selector

⚠️ **CRITICAL**: CloudLinux NodeJS Selector creates its own virtual environment and uses a symlink called `node_modules` for dependencies. Your application **MUST NOT** contain any folder or file named `node_modules` in the root directory.

#### Pre-Upload Preparation

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Clean your project** (Remove all node_modules)
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   
   # Linux/Mac
   rm -rf node_modules
   ```

3. **Verify no node_modules exists**
   - Ensure no `node_modules` folder exists in your project root
   - Check that `.gitignore` excludes `node_modules` (already configured)

#### cPanel Deployment Steps

1. **Upload files to cPanel File Manager**
   - Upload ALL project files EXCEPT `node_modules`
   - Include: `package.json`, `server.js`, `dist/` folder, all source files
   - **Never upload node_modules folder**

2. **Create NodeJS App in cPanel**
   - Navigate to "Node.js Selector" in cPanel
   - Click "Create App"
   - Set Node.js version: **18+** (recommended: Latest LTS)
   - Set Application Root: `/public_html/your-app-folder`
   - Set Application URL: `your-domain.com` or subdomain
   - Set Startup File: `server.js`

3. **Install Dependencies**
   ```bash
   # In cPanel Terminal or NodeJS Selector interface
   npm install
   ```
   CloudLinux will automatically create a symlinked `node_modules` in a separate virtual environment.

4. **Configure Environment Variables**
   - In NodeJS Selector, add environment variables:
     ```
     NODE_ENV=production
     VITE_APP_NAME=Ztooly
     VITE_APP_URL=https://yourdomain.com
     VITE_ANALYTICS_ENABLED=true
     ```

5. **Start the Application**
   - Click "Restart" in NodeJS Selector
   - Monitor logs for any errors
   - Visit your domain to verify deployment

#### Troubleshooting CloudLinux Issues

**Problem**: "node_modules already exists" error  
**Solution**: Delete any existing `node_modules` folder/file from your application root

**Problem**: Dependencies not installing  
**Solution**: 
- Ensure `package.json` is in the correct directory
- Check Node.js version compatibility
- Verify file permissions

**Problem**: App not starting  
**Solution**:
- Check `server.js` path in startup file setting
- Verify environment variables are set
- Check application logs in NodeJS Selector

#### Important Notes for CloudLinux

- ✅ Upload `package.json` - Required for dependency installation
- ✅ Upload `dist/` folder - Contains built frontend files  
- ✅ Upload `server.js` - Backend application entry point
- ❌ **NEVER** upload `node_modules` - CloudLinux manages this automatically
- ❌ Don't create manual `node_modules` symlinks
- ❌ Don't modify the auto-generated `node_modules` symlink
   - Or use: `npm start` or `node server.js`

**Why this matters**: CloudLinux manages Node.js dependencies in a virtual environment and creates a symlink called `node_modules` pointing to the actual modules. If you upload your own `node_modules` folder, it will conflict with CloudLinux's dependency management system.

### Traditional Hosting

1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure web server for SPA routing

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "server"]
```

## 🤝 Contributing

We welcome contributions! Here's how you can help make Ztooly even better:

### Ways to Contribute

- 🐛 **Report bugs** - Found an issue? Let us know!
- 💡 **Suggest features** - Have an idea for a new tool?
- 🔧 **Add tools** - Create new utilities for the community
- 📚 **Improve docs** - Help us make documentation better
- 🎨 **Design improvements** - Enhance the user interface
- 🌍 **Translations** - Help make Ztooly multilingual

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/ztooly.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-tool
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for all new code
   - Include appropriate comments
   - Test thoroughly

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing new tool for productivity'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-new-tool
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Reference any related issues

### Code Standards

- **TypeScript**: All new code should be written in TypeScript
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible
- **Testing**: Write tests for complex logic (coming soon)
- **Analytics**: Add analytics tracking for new tools
- **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📋 Roadmap

### 🎯 Current Status: v1.0 (Stable)
- ✅ 50+ tools implemented
- ✅ Mobile responsive design
- ✅ Analytics system
- ✅ SEO optimization
- ✅ Open source release

### 🚀 Upcoming Features

#### v1.1 - Enhanced User Experience
- [ ] **Dark/Light Theme Toggle** - User preference themes
- [ ] **Tool Favorites** - Save frequently used tools
- [ ] **Search Functionality** - Quick tool discovery
- [ ] **Recent Tools** - Access recently used tools
- [ ] **Keyboard Shortcuts** - Power user features

#### v1.2 - Advanced Tools
- [ ] **Advanced Image Editor** - Crop, rotate, filters
- [ ] **Video Tools** - Video compression, format conversion
- [ ] **API Testing Tool** - REST API testing interface
- [ ] **Database Query Builder** - Visual SQL builder
- [ ] **Regex Tester** - Interactive regex testing

#### v1.3 - Collaboration Features
- [ ] **Tool Sharing** - Share tool configurations
- [ ] **Export/Import Settings** - Backup user preferences
- [ ] **Team Workspaces** - Collaborative tool usage
- [ ] **Custom Tool Builder** - Create custom tools

#### v1.4 - Platform Expansion
- [ ] **PWA Support** - Progressive Web App features
- [ ] **Mobile Apps** - iOS and Android native apps
- [ ] **Browser Extensions** - Chrome, Firefox extensions
- [ ] **Desktop Apps** - Electron-based desktop apps

#### v2.0 - Major Platform Update
- [ ] **Plugin System** - Third-party tool plugins
- [ ] **AI Integration** - Advanced AI-powered tools
- [ ] **Cloud Sync** - Cross-device synchronization
- [ ] **Premium Features** - Advanced tools for power users

### 💡 Community Requested Features

Vote on features you'd like to see at [GitHub Discussions](https://github.com/your-username/ztooly/discussions)

- [ ] **Bulk File Processing** - Process multiple files at once
- [ ] **Template System** - Save and reuse configurations
- [ ] **Integration APIs** - Connect with external services
- [ ] **Advanced Analytics** - Detailed usage insights

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? We'd love to hear from you!

### 🔍 Reporting Bugs

Please [open an issue](https://github.com/your-username/ztooly/issues/new?template=bug_report.md) with:

- **Clear title** - Describe the issue in a few words
- **Steps to reproduce** - How can we recreate the bug?
- **Expected behavior** - What should happen?
- **Actual behavior** - What actually happens?
- **Screenshots** - Visual proof helps a lot
- **Environment** - Browser, OS, device info
- **Tool affected** - Which specific tool has the issue?

### 💡 Feature Requests

Have an idea? [Request a feature](https://github.com/your-username/ztooly/issues/new?template=feature_request.md) with:

- **Use case** - Why do you need this feature?
- **Proposed solution** - How should it work?
- **Alternatives** - What workarounds exist?
- **Tool category** - Where should it fit?
- **Mockups** - Visual examples are helpful

### 🚀 Priority Features

Current high-priority requests:
1. **Batch Processing** - Process multiple files at once
2. **Export Templates** - Save tool configurations
3. **Dark Theme** - Dark mode support
4. **Offline Mode** - Work without internet
5. **Mobile Apps** - Native mobile applications

## 🔐 Security & Privacy

### 🛡️ Data Protection

- **Local Processing** - Files processed in your browser when possible
- **No Storage** - Files are not stored on our servers
- **Privacy First** - No tracking beyond basic analytics
- **HTTPS Only** - All data transmission is encrypted
- **Open Source** - Transparent code for security review

### 🔒 Security Measures

- **Input Validation** - All user inputs are validated
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery protection
- **Content Security Policy** - Strict CSP headers
- **Regular Updates** - Dependencies updated regularly

### 📊 Analytics

We collect minimal analytics to improve the service:
- Tool usage statistics (anonymous)
- Performance metrics
- Error reporting
- No personal information
- Can be disabled via environment variables

## 🌍 Browser Support

Ztooly supports all modern browsers:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 88+
- Samsung Internet 14+

## ⚡ Performance

Ztooly is optimized for performance:

- **Fast Loading** - Initial page load under 2 seconds
- **Efficient Processing** - Tools optimized for speed
- **Memory Management** - Proper cleanup to prevent leaks
- **Code Splitting** - Load only what you need
- **Image Optimization** - Compressed images and icons
- **CDN Delivery** - Fast content delivery worldwide

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify the code as needed
- ✅ **Distribution** - Share and redistribute
- ✅ **Private use** - Use for personal projects
- ❗ **License and copyright notice** - Include in copies
- ❌ **Liability** - No warranty provided
- ❌ **Warranty** - Use at your own risk

## 🙏 Acknowledgments

### Core Technologies
- [React](https://reactjs.org/) - UI library for building interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- [Express](https://expressjs.com/) - Fast, minimalist web framework

### Special Thanks
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who helped improve Ztooly
- **Users** - For feedback and feature requests
- **Beta Testers** - For helping catch bugs early
- **Design Inspiration** - Various design systems and style guides

### Attribution
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Illustrations inspired by [Heroicons](https://heroicons.com/)

## 📞 Support & Community

### 🆘 Getting Help

- **📚 Documentation** - [docs.ztooly.com](https://docs.ztooly.com)
- **💬 Community** - [Discord Server](https://discord.gg/ztooly)
- **📧 Email** - support@ztooly.com
- **🐦 Twitter** - [@ZtoolyDev](https://twitter.com/ZtoolyDev)
- **🐙 GitHub** - [Issues & Discussions](https://github.com/your-username/ztooly)

### 🌟 Stay Updated

- **⭐ Star this repo** - Get notified of updates
- **👀 Watch releases** - Stay informed about new versions
- **📬 Newsletter** - [Subscribe for updates](https://ztooly.com/newsletter)
- **📱 Social Media** - Follow us for tips and updates

### 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share your knowledge and experience
- Report issues constructively
- Contribute positively to discussions

## 📊 Project Stats

- **50+** Tools available
- **100%** Free and open source
- **TypeScript** for type safety
- **Mobile** responsive design
- **SEO** optimized
- **Fast** loading times
- **Privacy** focused
- **Regular** updates

---

<div align="center">

### 🚀 Ready to boost your productivity?

[![Try Ztooly](https://img.shields.io/badge/🌐_Try_Ztooly-ztooly.com-4285f4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ztooly.com)
[![Star on GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-Contribute-181717?style=for-the-badge&logo=github)](https://github.com/your-username/ztooly)

**Made with ❤️ by the Ztooly Team**

*Empowering productivity, one tool at a time.*

<p>
  <a href="https://ztooly.com">🌐 Website</a> •
  <a href="https://docs.ztooly.com">📚 Docs</a> •
  <a href="https://github.com/your-username/ztooly/issues">🐛 Issues</a> •
  <a href="https://discord.gg/ztooly">💬 Discord</a> •
  <a href="https://twitter.com/ZtoolyDev">🐦 Twitter</a>
</p>

</div>


tools generator converter calculator qr-code password-generator lorem-ipsum color-palette json-tools csv-converter markdown pdf-merger image-resizer background-remover social-media-tools
=======
# � Ztooly - The Ultimate Free Online Tool Collection

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ztooly.com-4285f4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ztooly.com)
[![License: MIT](https://img.shields.io/badge/📄_License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/⚡_Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/⚛️_React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/🔷_TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/🤝_PRs-Welcome-ff69b4.svg?style=for-the-badge)](http://makeapullrequest.com)

**Ztooly** is a comprehensive collection of **50+ free online tools** designed to boost productivity and simplify everyday tasks. From AI-powered generators to image processing, data conversion to developer utilities - Ztooly provides everything you need in one intuitive platform.

> 🎯 **Mission**: Empowering users with powerful, free tools while maintaining privacy and performance.

## ⭐ Why Choose Ztooly?

- 🆓 **100% Free** - No hidden costs, no premium tiers
- 🔒 **Privacy First** - Files processed locally when possible
- ⚡ **Lightning Fast** - Optimized for speed and performance
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean, intuitive interface
- 🔧 **Developer Friendly** - Open source and extensible

## 🚀 Features

- **🎨 Modern UI/UX** - Clean, responsive interface built with React and Tailwind CSS
- **⚡ Fast Performance** - Optimized for speed with Vite build system
- **🔧 Developer Tools** - Collection of essential utilities for developers
- **📱 Responsive Design** - Works seamlessly across all devices
- **🌙 Dark Mode** - Built-in dark/light theme support
- **🛡️ Type Safety** - Full TypeScript support for better development experience
- **🔌 Extensible** - Modular architecture for easy feature additions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/effortless-utility-kit.git
   cd effortless-utility-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

## 🏗️ Project Structure

```
effortless-utility-kit/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/          # Application pages
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles
├── docs/               # Documentation
├── tests/              # Test files
└── package.json        # Project configuration
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

## 🧩 Utility Categories

### 🔤 Text Utilities
- Text formatting and manipulation
- Case converters
- String validators
- Text analysis tools

### 🔢 Number Utilities
- Number formatters
- Mathematical calculators
- Unit converters
- Random generators

### 🎨 Design Tools
- Color palette generators
- CSS utilities
- Layout helpers
- Design system components

### 🌐 Web Development
- URL validators and parsers
- HTTP status code reference
- Browser compatibility checks
- Performance optimization tools

### 📊 Data Processing
- JSON formatters and validators
- CSV processors
- Data converters
- File utilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add TypeScript types for all new code
- Include appropriate comments for complex logic
- Ensure all tests pass before submitting

## 📋 Roadmap

- [ ] **v1.1**: Advanced text processing tools
- [ ] **v1.2**: Image manipulation utilities
- [ ] **v1.3**: API testing tools
- [ ] **v1.4**: Database utilities
- [ ] **v1.5**: Mobile app version
- [ ] **v2.0**: Plugin system and marketplace

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/your-username/effortless-utility-kit/issues/new) with:

- **Bug Reports**: Steps to reproduce, expected vs actual behavior, screenshots
- **Feature Requests**: Use case, proposed solution, alternatives considered

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- All contributors and users of this project

## 📞 Support

- **Documentation**: [docs.ztooly.com](https://docs.ztooly.com)
- **Community**: [Discord Server](https://discord.gg/ztooly)
- **Email**: support@ztooly.com
- **Twitter**: [@ZtoolyDev](https://twitter.com/ZtoolyDev)

---

<div align="center">
  <p>Made with ❤️ by the Ztooly Team</p>
  <p>
    <a href="https://ztooly.com">Website</a> •
    <a href="https://docs.ztooly.com">Documentation</a> •
    <a href="https://github.com/your-username/effortless-utility-kit/issues">Issues</a> •
    <a href="https://discord.gg/ztooly">Discord</a>
  </p>
</div>
>>>>>>> 690863ef5907c2858acdec5bcafe82b6991c9aa3
