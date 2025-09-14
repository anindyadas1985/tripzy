# Journai Admin Console

A comprehensive administrative dashboard for managing the Journai Travel Platform.

## Features

### 🎯 **Core Administration**
- **Dashboard**: Real-time metrics and system overview
- **User Management**: Manage travelers and vendors
- **Vendor Management**: Approve, suspend, and monitor service providers
- **Trip Management**: Monitor all user trips and bookings
- **Booking Management**: Track transactions and commissions

### 📊 **Analytics & Monitoring**
- **Analytics Dashboard**: Revenue, user growth, and performance metrics
- **System Monitoring**: Real-time server health and performance
- **Audit Logs**: Complete activity tracking and compliance

### ⚙️ **Configuration**
- **Settings**: Platform configuration and API integrations
- **Security**: Access control and security policies
- **Notifications**: Alert and communication settings

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin console will be available at `http://localhost:3001`

### Default Login
- **Email**: admin@journai.com
- **Password**: admin123

## Architecture

### 🏗️ **Component Structure**
```
admin/src/
├── components/          # UI components
│   ├── AdminLogin.tsx   # Authentication
│   ├── Dashboard.tsx    # Main dashboard
│   ├── UserManagement.tsx
│   ├── VendorManagement.tsx
│   ├── Analytics.tsx
│   └── ...
├── contexts/           # React contexts
│   └── AdminContext.tsx
└── main.tsx           # App entry point
```

### 🎨 **Design System**
- **Dark Theme**: Professional admin interface
- **Gradient Accents**: Amber/orange for primary actions
- **Responsive**: Works on desktop and mobile
- **Accessible**: WCAG compliant components

### 🔐 **Security Features**
- Role-based access control
- Session management
- Audit logging
- IP whitelisting support
- Two-factor authentication ready

## Key Features

### 📈 **Real-time Dashboard**
- Live user and booking statistics
- Revenue tracking and growth metrics
- System health monitoring
- Recent activity feed

### 👥 **User Management**
- Search and filter users
- Approve/suspend accounts
- View user activity and spending
- Bulk operations support

### 🏢 **Vendor Management**
- Vendor verification workflow
- Performance metrics and ratings
- Revenue tracking per vendor
- Approval/rejection system

### 📊 **Advanced Analytics**
- Revenue trends and forecasting
- User segmentation analysis
- Top destinations and routes
- Conversion funnel metrics

### 🔍 **System Monitoring**
- Real-time performance metrics
- Service health checks
- Alert management
- Resource utilization tracking

### 📋 **Audit & Compliance**
- Complete action logging
- User activity tracking
- Security event monitoring
- Export capabilities for compliance

## Configuration

### Environment Variables
Create a `.env` file in the admin directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_API_KEY=your-admin-api-key
```

### Integration with Main App
The admin console can be integrated with the main Journai app by:

1. **Shared Database**: Both apps use the same Supabase instance
2. **API Integration**: Admin console calls main app APIs
3. **SSO Integration**: Single sign-on for admin users

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag and drop build folder
- **GCP/AWS**: Use provided infrastructure scripts
- **Docker**: Containerized deployment ready

## Security Considerations

### 🔒 **Access Control**
- Admin-only access with strong authentication
- Role-based permissions (super_admin, admin, moderator)
- IP whitelisting for additional security
- Session timeout and management

### 🛡️ **Data Protection**
- Encrypted API communications
- Secure credential storage
- Audit trail for all actions
- GDPR compliance features

### 🚨 **Monitoring**
- Failed login attempt tracking
- Suspicious activity detection
- Real-time security alerts
- Automated threat response

## Development

### Adding New Features
1. Create component in `src/components/`
2. Add route to navigation
3. Update context if needed
4. Add to main App component

### Styling Guidelines
- Use Tailwind CSS classes
- Follow dark theme patterns
- Maintain responsive design
- Use consistent spacing (8px grid)

### State Management
- React Context for global state
- Local state for component-specific data
- Mock data for development
- Real API integration for production

## Support

For technical support or feature requests:
- Create GitHub issues
- Contact: admin-support@journai.com
- Documentation: [Admin Guide](docs/admin-guide.md)

---

**🎉 Your Journai Admin Console is ready for comprehensive platform management!**