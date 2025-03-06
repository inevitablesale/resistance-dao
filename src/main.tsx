
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FormoAnalyticsProvider } from '@formo/analytics';

createRoot(document.getElementById("root")!).render(
  <FormoAnalyticsProvider writeKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJodHRwczovL3d3dy5yZXNpc3RhbmNlZGFvLnh5ei8iLCJwcm9qZWN0X2lkIjoiak8zeVFYSU5fZm11TVQ3OWJ0d0tpIiwiaWF0IjoxNzQxMjMwNDIzfQ.fuNvgWDIl0cRAqPPw_RxNZJBu4_3E87z8rF4UAaYCBU">
    <App />
  </FormoAnalyticsProvider>
);
