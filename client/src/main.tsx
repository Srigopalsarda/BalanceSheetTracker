import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { v4 as uuidv4 } from 'uuid';

// This ensures uuid is always available for ID generation
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: uuidv4
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
