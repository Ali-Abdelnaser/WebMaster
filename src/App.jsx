import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import CommitteePage from "./pages/CommitteePage";
import TrackPage from "./pages/TrackPage";
// Pages
import Home from "./pages/Home";
import JoinUs from "./pages/JoinUs";
import JoinCS from "./pages/JoinCS";
import Events from "./pages/Events";
import IeeePage from "./pages/IeeePage";
import Wie from "./pages/Wie";
import CS from "./pages/CS";
import About from "./pages/About";
import AESS from "./pages/AESS";
import ScrollToTopButton from "./components/ScrollToTopButton";
// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // كل ما يتغير الراوت نرجع لأعلى الصفحة
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // إضافة كلاس للبودي بناءً على الصفحة الحالية لتغيير الثيم (الاسكرول والباتون)
    const body = document.body;
    body.className = ""; // مسح الكلاسات القديمة
    const path = pathname.toLowerCase();
    if (path.includes("/cs") || path.includes("/track")) {
      body.classList.add("cs-theme");
    } else if (path.includes("/wie")) {
      body.classList.add("wie-theme");
    }
  }, [pathname]);

  return null;
}
import { HelmetProvider } from "react-helmet-async";


// AnimatedRoutes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinUs />} />
        <Route path="/join-cs" element={<JoinCS />} />
        <Route path="/events" element={<Events />} />
        <Route path="/wie" element={<Wie />} />
        <Route path="/CS" element={<CS />} />
        <Route path="/ieee" element={<IeeePage />} />
        <Route path="/AESS" element={<AESS />} />
        <Route path="/about" element={<About />} />
        <Route path="/committee/:name" element={<CommitteePage />} />
        <Route path="/track/:name" element={<TrackPage />} />
      </Routes>
    </AnimatePresence>
  );
}

// App component
function App() {
  return (
    <Router>
      <Analytics/>
      <SpeedInsights/>
      <ScrollToTop />
      <ScrollToTopButton />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
