import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Zero } from "@rocicorp/zero";
import { schema } from "./schema.ts";
import { ZeroProvider } from "@rocicorp/zero/react";

const zeroUrl = import.meta.env.VITE_ZERO_URL || "http://localhost:4848";

const z = new Zero({
  userID: "anon",
  schema,
  server: zeroUrl,
  kvStore: "idb",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZeroProvider zero={z}>
      <App />
    </ZeroProvider>
  </StrictMode>,
);
