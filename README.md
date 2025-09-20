# EnergyMetrics Pro

A comprehensive energy calculation and analysis platform developed for APSPDCL (Andhra Pradesh State Power Distribution Company Limited). This platform provides advanced tools for energy calculations, financial analysis, and decision-making across domestic, commercial, and industrial sectors.

## 🌟 Features

### 🔢 Energy Calculators
- **Domestic Calculator** - Residential energy consumption and cost analysis
- **Commercial Calculator** - Business energy usage calculations
- **Industrial Calculator** - Industrial power consumption analysis

### 💰 Financial Analysis Tools
- **ROI Calculator** - Return on Investment analysis for energy projects
- **Payback Calculator** - Payback period calculations
- **Break-Even Analyzer** - Break-even point analysis
- **Cost-Benefit Analyzer** - Comprehensive cost vs. benefit evaluation
- **NPV Chart** - Net Present Value analysis and visualization
- **Unified Estimator** - All-in-one estimation tool

### 📊 Data Visualization
- **Bill Breakdown Charts** - Detailed bill analysis and visualization
- **Energy Distribution Charts** - Energy usage pattern visualization
- **Solar Savings Charts** - Solar energy savings analysis
- **Break-Even Charts** - Break-even analysis visualization
- **Payback Charts** - Payback period visualization
- **NPV Charts** - Net Present Value charts

### 🎯 Smart Recommendations
- **General Recommendations** - Expert energy efficiency advice
- **Solar Recommendations** - Solar energy optimization suggestions
- **Unified Estimator** - Comprehensive project estimation

### 👥 User Management
- **User Authentication** - Secure login and registration system
- **Admin Panel** - Tariff management and system administration
- **Calculation History** - Track and review previous calculations
- **Protected Routes** - Role-based access control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd energy-metrics-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Admin/           # Admin panel components
│   ├── Auth/            # Authentication components
│   ├── Calculations/    # Energy calculation tools
│   ├── Charts/          # Data visualization components
│   ├── Estimations/     # Financial analysis tools
│   ├── History/         # Calculation history
│   ├── Layout/          # Layout components
│   └── Recommendations/ # Smart recommendation system
├── contexts/            # React contexts
├── lib/                 # External library configurations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── main.tsx            # Application entry point
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Charts**: Chart.js with React wrappers
- **State Management**: React Context API
- **Routing**: React Router
- **Code Quality**: ESLint, Prettier

## 📱 Usage

### For End Users
1. **Register/Login** - Create an account or sign in
2. **Select Calculator** - Choose from Domestic, Commercial, or Industrial
3. **Input Data** - Enter energy consumption details
4. **View Results** - Get detailed calculations and charts
5. **Save History** - Access previous calculations anytime
6. **Get Recommendations** - Receive expert advice for optimization

### For Administrators
1. **Access Admin Panel** - Manage system settings
2. **Tariff Management** - Update energy rates and tariffs
3. **User Management** - Monitor user activities
4. **System Analytics** - View platform usage statistics

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### TypeScript
TypeScript configuration is in `tsconfig.json` and `tsconfig.app.json`.

### Vite
Build and development configuration is in `vite.config.ts`.

## 📊 API Integration

The platform integrates with Supabase for:
- User authentication and management
- Data storage and retrieval
- Real-time updates
- Secure API endpoints

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Vercel** - Recommended for React applications
- **Netlify** - Great for static sites
- **AWS S3 + CloudFront** - Enterprise deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for APSPDCL. All rights reserved.

## 👥 Team

- **Development Team** - EnergyMetrics Pro Development Team
- **Client** - APSPDCL (Andhra Pradesh State Power Distribution Company Limited)
- **Project Manager** - [Project Manager Name]

## 📞 Support

For technical support or questions:
- **Email**: [support-email]
- **Documentation**: [documentation-url]
- **Issue Tracker**: [github-issues-url]

## 🔄 Version History

- **v1.0.0** - Initial release with core calculators
- **v1.1.0** - Added financial analysis tools
- **v1.2.0** - Implemented recommendation system
- **v1.3.0** - Enhanced admin panel and tariff management

## 🎯 Roadmap

- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Integration with smart meters
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced reporting features

---

**EnergyMetrics Pro** - Empowering energy decisions with data-driven insights.

