import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import { PersonProvider } from '@/contexts/PersonContext';
import App from "./App.tsx";
import 'md-editor-rt/lib/preview.css';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PersonProvider>
        <App />
      </PersonProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
