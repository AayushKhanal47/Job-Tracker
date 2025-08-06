import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingNavbar from "./components/LandingNavBar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingNavbar />} />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
