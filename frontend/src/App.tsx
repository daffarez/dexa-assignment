import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
