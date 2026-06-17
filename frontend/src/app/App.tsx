import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../context/AuthContext";
import { SplashLoader } from "./components/SplashLoader";

export default function App() {
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem("aarambh_splash_shown") === "true"
  );

  const handleSplashDone = () => {
    sessionStorage.setItem("aarambh_splash_shown", "true");
    setSplashDone(true);
  };

  return (
    <AuthProvider>
      {!splashDone && <SplashLoader onDone={handleSplashDone} />}
      <div style={{ pointerEvents: splashDone ? "auto" : "none", userSelect: splashDone ? "auto" : "none" }}>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}
