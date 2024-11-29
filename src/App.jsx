// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicationsOfOpportunitiesIManage from "./pages/ApplicationsOfOpportunitiesIManage.jsx";
import HomePage from "./pages/Home.jsx";
import { Layout } from "./pages/Layout.jsx";
import OGXPage from "./pages/OGXPage.jsx"; // Ensure OGXPage exists
import AuthWrapper from "./components/AuthWrapper.jsx";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthWrapper>
                <Layout />
              </AuthWrapper>
            }
          >
            <Route path="/" element={<HomePage />} /> {/* Default/Home Page */}
            <Route
              path="/icx/applications/my-opportunities"
              element={<ApplicationsOfOpportunitiesIManage />}
            />
            <Route path="/ogx" element={<OGXPage />} /> {/* OGX Page */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
