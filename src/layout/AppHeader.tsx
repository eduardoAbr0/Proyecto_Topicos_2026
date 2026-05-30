"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const HEADER_BG = "#A8BBA3";
const TEXT_DARK = "#1a2419";
const TEXT_LIGHT = "#F7F4EA";
const DROPDOWN_BG = "#2C3A2B";
const HOVER_BG = "#3a4d38";
const ACCENT = "#B87C4C";

const IconBell = () => (
  <i className="fa-solid fa-bell" style={{ fontSize: '20px' }} />
);

const IconUser = () => (
  <i className="fa-solid fa-user" style={{ fontSize: '20px' }} />
);

const IconLogout = () => (
  <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '16px' }} />
);

const IconChevronDown = () => (
  <i className="fa-solid fa-chevron-down" style={{ fontSize: '14px' }} />
);

type AppHeaderProps = {
  sidebarWidth?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onLogout?: () => void;
};

export default function AppHeader({
  sidebarWidth = 260,
  userName = "Admin",
  userRole = "Administrador",
  onLogout,
}: AppHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 1030,
      height: 64,
      backgroundColor: HEADER_BG,
      marginLeft: sidebarWidth,
      transition: "margin-left 0.3s ease",
      display: "flex", alignItems: "center",
      padding: "0 24px",
      justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 700, fontSize: 16,
          color: TEXT_DARK,
          letterSpacing: 0.5,
        }}>
          Panel de Administración
        </span>
      </div>

      {/* notificaciones y usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Notificaciones */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(p => !p); setDropdownOpen(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: TEXT_DARK, padding: "8px", borderRadius: 8,
              display: "flex", alignItems: "center",
              position: "relative",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <IconBell />
            {/* Badge */}
            <span style={{
              position: "absolute", top: 4, right: 4,
              width: 8, height: 8, borderRadius: "50%",
              background: ACCENT, border: "2px solid " + HEADER_BG,
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: 280, background: DROPDOWN_BG,
              borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              overflow: "hidden", zIndex: 2000,
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid " + HOVER_BG }}>
                <span style={{ color: TEXT_LIGHT, fontWeight: 600, fontSize: 13, fontFamily: "Outfit, sans-serif" }}>
                  Notificaciones
                </span>
              </div>
              <div style={{ padding: "12px 16px", color: "#a0b09b", fontSize: 13, fontFamily: "Outfit, sans-serif" }}>
                No hay notificaciones nuevas.
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 32, background: "rgba(0,0,0,0.15)", margin: "0 4px" }} />

        {/* Usuario */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setDropdownOpen(p => !p); setNotifOpen(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 10px", borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: DROPDOWN_BG,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#A8BBA3", flexShrink: 0,
              border: "2px solid rgba(255,255,255,0.2)",
            }}>
              <IconUser />
            </div>

            <div style={{ textAlign: "left" }} className="d-none d-md-block">
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 13, color: TEXT_DARK, lineHeight: 1.2 }}>
                {userName}
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: "rgba(0,0,0,0.5)", lineHeight: 1.2 }}>
                {userRole}
              </div>
            </div>

            <span style={{ color: TEXT_DARK, opacity: 0.6 }}>
              <IconChevronDown />
            </span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: 200, background: DROPDOWN_BG,
              borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              overflow: "hidden", zIndex: 2000,
            }}>

              {/* Cerrar sesion */}
              <div style={{ padding: "6px 0" }}>
                <button
                  onClick={() => { setDropdownOpen(false); onLogout?.(); }}
                  style={{
                    width: "100%", background: "none", border: "none",
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", color: "#e07070",
                    fontFamily: "Outfit, sans-serif", fontSize: 13,
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = HOVER_BG)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <IconLogout /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
