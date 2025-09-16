import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import CommitteePage from "./pages/CommitteePage";
// Pages
import Home from "./pages/Home";
import JoinUs from "./pages/JoinUs";
import Events from "./pages/Events";
import Wie from "./pages/Wie";
import CS from "./pages/CS";
import About from "./pages/About";
import AESS from "./pages/AESS";

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // كل ما يتغير الراوت نرجع لأعلى الصفحة
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

// AnimatedRoutes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinUs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/wie" element={<Wie />} />
        <Route path="/CS" element={<CS />} />
        <Route path="/AESS" element={<AESS />} />
        <Route path="/about" element={<About />} />
        <Route path="/committee/:name" element={<CommitteePage />} />
      </Routes>
    </AnimatePresence>
  );
}

// App component
function App() {
  return (
    <Router>
      <ScrollToTop />

      <AnimatedRoutes />
    </Router>
  );
}

export default App;
