
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ServiceWorker } from "./components/ServiceWorker";

// Add performance monitoring
const startTime = performance.now();

// Preload critical resources
const preloadSupabase = document.createElement('link');
preloadSupabase.rel = 'preconnect';
preloadSupabase.href = 'https://lrnfshwotkvbiqkquqtm.supabase.co';
document.head.appendChild(preloadSupabase);

// Register Service Worker for offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

// Performance logging
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`📊 App loaded in ${loadTime.toFixed(2)}ms`);
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ServiceWorker />
    <App />
  </StrictMode>
);
