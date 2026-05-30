"use client";
import React, { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setSidebarWidth(mobile ? 0 : 260);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f4" }}>
      <AppSidebar />

      <div style={{
        marginLeft: isMobile ? 0 : sidebarWidth,
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        <AppHeader
          sidebarWidth={0}
          userName="Admin"
          userRole="Administrador"
          onLogout={async () => {
            try {
              const response = await fetch('/api/auth/logout', { method: 'POST' });
              const data = await response.json();

              if (data.status === "exito") {
                window.location.href = '/login';
              }
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }

            console.log("Logout");
          }}
        />

        <main style={{ flex: 1, padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
