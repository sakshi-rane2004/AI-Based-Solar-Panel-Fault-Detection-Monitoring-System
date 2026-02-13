# Solar Panel Fault Detection Dashboard

A React frontend dashboard for the AI-based solar panel fault detection system. This application provides a clean, responsive interface for analyzing sensor data, viewing prediction history, and monitoring system analytics.

## Features

- **Dashboard Overview**: Quick system status and recent predictions
- **Sensor Data Analysis**: Input form with real-time fault detection
- **Prediction History**: Searchable and filterable history table
- **Analytics Charts**: Interactive pie and line charts for insights
- **Severity Indicators**: Color-coded badges for fault severity levels
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **React 18** - Modern React with functional components and hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js & React-Chartjs-2** - Interactive charts and visualizations
- **CSS3** - Custom styling with responsive design

## Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js              # Navigation header
│   │   ├── SeverityBadge.js       # Severity level indicator
│   │   ├── LoadingSpinner.js      # Loading component
│   │   ├── ErrorAlert.js          # Error display component
│   │   └── ConfidenceBar.js       # Confidence level bar
│   ├── pages/
│   │   ├── Dashboard.js           # Main dashboard page
│   │   ├── Analyze.js             # Sensor data input and analysis
│   │   ├── History.js             # Prediction history table
│   │   └── Analytics.js           # Charts and analytics
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── App.js                     # Main app component
│   ├── App.css                    # App-specific styles
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── package.json
└── README.md
```

## Prerequisites

- **Node.js 16+** and npm
- **Spring Boot backend** running on `http://localhost:8080`
- **Python ML API** running on `http://localhost:5000`

## Installation & Setup

### 1. Install Dependencies

```bash
cd react-frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will start on `http://localhost:3000` and automatically proxy API requests to the Spring Boot backend.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## API Integration

The frontend connects to the Spring Boot backend APIs:

### Endpoints Used

- `POST /api/v1/solar-panel/analyze` - Analyze sensor data
- `GET /api/v1/solar-panel/history` - Get prediction history
- `GET /api/v1/solar-panel/history/recent` - Get recent predictions
- `GET /api/v1/analytics/summary` - Get analytics summary
- `GET /api/v1/analytics/trends` - Get trend data
- `GET /api/v1/solar-panel/statistics/fault-types` - Get fault statistics

### API Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: '/api/v1',  // Proxied to http://localhost:8080/api/v1
  timeout: 30000,
});
```

## Pages & Components

### 1. Dashboard (`/`)
- System overview with key statistics
- Recent predictions table
- Quick action buttons
- System status indicators

### 2. Analyze (`/analyze`)
- Sensor data input form with validation
- Real-time fault prediction
- Sample data buttons for testing
- Detailed prediction results with recommendations

### 3. History (`/history`)
- Paginated prediction history table
- Filtering by fault type and severity
- Sortable columns
- Detailed prediction information

### 4. Analytics (`/analytics`)
- Fault type distribution pie chart
- Severity distribution pie chart
- Prediction trends line chart
- Statistical breakdowns and insights

## Key Features

### Severity Color Coding
- **None**: Green (Normal operation)
- **Low**: Yellow (Minor issues)
- **Medium**: Orange (Moderate issues)
- **High**: Red (Significant issues)
- **Critical**: Purple with pulse animation (Urgent)

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Collapsible navigation on small screens
- Touch-friendly interface

### Error Handling
- Network error detection
- User-friendly error messages
- Retry functionality
- Loading states

### Data Visualization
- Interactive Chart.js charts
- Real-time data updates
- Customizable time ranges
- Export capabilities

## Sample Data

The analyze page includes sample data buttons for testing:

- **Normal Panel**: Typical healthy panel readings
- **Shaded Panel**: Partial shading scenario
- **Faulty Panel**: Inverter fault scenario

## Customization

### Styling
- Global styles in `src/index.css`
- Component-specific styles in `src/App.css`
- CSS custom properties for theming
- Responsive breakpoints

### API Configuration
- Modify `src/services/api.js` for different backend URLs
- Add authentication headers if needed
- Customize timeout and retry logic

### Charts
- Chart.js configuration in `src/pages/Analytics.js`
- Customizable colors, labels, and data formats
- Additional chart types can be added

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (irreversible)

### Development Tips

1. **Hot Reload**: Changes automatically refresh the browser
2. **Console Logging**: API calls are logged to browser console
3. **Error Boundaries**: Errors are caught and displayed gracefully
4. **Proxy Setup**: Backend API calls are automatically proxied

### Adding New Features

1. **New Page**: Create component in `src/pages/` and add route in `App.js`
2. **New API**: Add function to `src/services/api.js`
3. **New Component**: Create in `src/components/` and import where needed
4. **New Styles**: Add to `src/index.css` or component-specific CSS

## Deployment

### Development Deployment
```bash
npm start
```

### Production Deployment
```bash
npm run build
# Serve the build/ directory with a web server
```

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Code splitting with React.lazy (can be added)
- Image optimization
- Minified production builds
- Gzip compression support

## Security

- XSS protection through React's built-in escaping
- CSRF protection via API configuration
- Input validation on forms
- Secure API communication

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure Spring Boot backend is running on port 8080
   - Check proxy configuration in package.json

2. **Charts Not Displaying**
   - Verify Chart.js dependencies are installed
   - Check browser console for errors

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Debug Mode

Enable debug logging by setting:
```javascript
// In src/services/api.js
console.log('API Request:', config);
```

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain responsive design
4. Add error handling for new features
5. Update documentation for changes

## License

This project is open source and available under the MIT License.