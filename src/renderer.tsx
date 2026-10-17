import { createRoot } from 'react-dom/client';
import App from './app';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Application root element was not found');
}

createRoot(rootElement).render(<App />);