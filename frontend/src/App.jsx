import { useState } from "react";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewIncident from "./pages/NewIncident";
import IncidentAnalyzer from "./pages/IncidentAnalyzer";
import IncidentHistory from "./pages/IncidentHistory";
import Analytics from "./pages/Analytics";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import "./index.css";


function AppContent() {
  const {
    user,
    loading,
    signOut,
    setAuthenticatedUser,
  } = useAuth();


  const [page, setPage] =
    useState("dashboard");

  const [selectedIncidentId, setSelectedIncidentId] =
    useState(null);

  const [authMode, setAuthMode] =
    useState("login");


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />

        <p>
          Loading CyberSentinel AI...
        </p>
      </div>
    );
  }


  if (!user) {
    if (authMode === "register") {
      return (
        <Register
          onRegistered={() =>
            setAuthMode("login")
          }
          onBack={() =>
            setAuthMode("login")
          }
        />
      );
    }

    return (
      <Login
        onLogin={(data) => {
          setAuthenticatedUser(
            data.user
          );

          setPage("dashboard");
        }}
        onRegister={() =>
          setAuthMode("register")
        }
      />
    );
  }


  const titles = {
    dashboard:
      "Security Dashboard",

    new:
      "Create Incident",

    analyzer:
      "AI Incident Analyzer",

    history:
      "Incident History",

    analytics:
      "Security Analytics",
  };


  function openIncident(id) {
    setSelectedIncidentId(id);
    setPage("analyzer");
  }


  function handleCreated(incident) {
    if (incident?.id) {
      setSelectedIncidentId(
        incident.id
      );

      setPage("analyzer");
    } else {
      setPage("dashboard");
    }
  }


  function handleLogout() {
    signOut();

    setSelectedIncidentId(null);
    setPage("dashboard");
  }


  return (
    <div className="app-shell">

      <Sidebar
        page={page}
        onNavigate={setPage}
        selectedIncidentId={
          selectedIncidentId
        }
        onLogout={handleLogout}
      />


      <main className="main-content">

        <Navbar
          user={user}
          title={titles[page]}
        />


        <section className="page-content">

          {page === "dashboard" && (
            <Dashboard
              user={user}
              onNewIncident={() =>
                setPage("new")
              }
              onOpenIncident={
                openIncident
              }
            />
          )}


          {page === "new" && (
            <NewIncident
              onCreated={handleCreated}
              onCancel={() =>
                setPage("dashboard")
              }
            />
          )}


          {page === "analyzer" && (
            <IncidentAnalyzer
              incidentId={
                selectedIncidentId
              }
              onBack={() =>
                setPage("dashboard")
              }
            />
          )}


          {page === "history" && (
            <IncidentHistory
              onOpenIncident={
                openIncident
              }
            />
          )}


          {page === "analytics" && (
            <Analytics />
          )}

        </section>

      </main>

    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App;