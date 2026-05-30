"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconMiembros = () => (
  <i className="fa-solid fa-users" style={{ fontSize: '20px' }} />
);

const IconObras = () => (
  <i className="fa-solid fa-masks-theater" style={{ fontSize: '20px' }} />
);

const IconFinanzas = () => (
  <i className="fa-solid fa-coins" style={{ fontSize: '20px' }} />
);

const IconBoletos = () => (
  <i className="fa-solid fa-ticket" style={{ fontSize: '20px' }} />
);

const IconReportes = () => (
  <i className="fa-solid fa-chart-line" style={{ fontSize: '20px' }} />
);

const IconMenu = () => (
  <i className="fa-solid fa-bars" style={{ fontSize: '20px' }} />
);

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string; 
};

const navItems: NavItem[] = [
  { 
    name: "Miembros",
    icon: <IconMiembros />,
    path: "/admin/miembros"
  },
  {
    name: "Obras",
    icon: <IconObras />,
    path: "/admin/obras"
  },
  {
    name: "Boletos",
    icon: <IconBoletos />,
    path: "/admin/boletos"
  },
  {
    name: "Finanzas",
    icon: <IconFinanzas />,
    path: "/admin/finanzas"
  },
  {
    name: "Reportes",
    icon: <IconReportes />,
    path: "/admin/reportes"
  },
];

const SIDEBAR_BG = "#2C3A2B";   
const SIDEBAR_HOVER = "#3a4d38";
const ACCENT = "#A8BBA3";   
const TEXT_MAIN = "#F7F4EA";   
const TEXT_MUTED = "#a0b09b";
const ACTIVE_BG = "#A8BBA3";
const ACTIVE_TEXT = "#1a2419";

export default function AppSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) setMobileOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isVisible = isMobile ? mobileOpen : true;
  const isWide = isMobile ? true : (expanded || hovered);
  const sidebarW = isWide ? 260 : 72;
  const isActive = (path: string) => path === pathname;

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 1040,
          }}
        />
      )}

      <aside
        onMouseEnter={() => !expanded && !isMobile && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed", top: 0, left: 0, height: "100vh",
          width: sidebarW,
          background: SIDEBAR_BG,
          borderRight: `1px solid ${SIDEBAR_HOVER}`,
          transition: "width 0.3s ease, transform 0.3s ease",
          transform: isVisible ? "translateX(0)" : "translateX(-100%)",
          zIndex: 1050,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >

        <div style={{
          height: 64, display: "flex", alignItems: "center",
          padding: isWide ? "0 20px" : "0",
          justifyContent: isWide ? "space-between" : "center",
          borderBottom: `1px solid ${SIDEBAR_HOVER}`,
          flexShrink: 0,
        }}>
          {isWide && (
            <span style={{ color: TEXT_MAIN, fontWeight: 700, fontSize: 18, fontFamily: "Outfit, sans-serif", letterSpacing: 1 }}>
              Theather<span style={{ color: ACCENT }}>Admin</span>
            </span>
          )}
          {!isMobile && (
            <button
              onClick={() => setExpanded(p => !p)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: TEXT_MUTED, padding: 8, borderRadius: 6,
                display: "flex", alignItems: "center",
              }}
            >
              <IconMenu />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {isWide && (
            <p style={{
              color: TEXT_MUTED, fontSize: 10, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: 2,
              padding: "8px 20px 4px", margin: 0,
            }}>
              Menú
            </p>
          )}

          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <div key={item.name}>
                <Link
                  href={item.path}
                  title={!isWide ? item.name : undefined}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: 12, padding: isWide ? "10px 20px" : "10px 0",
                    justifyContent: isWide ? "flex-start" : "center",
                    color: active ? ACTIVE_TEXT : TEXT_MAIN,
                    backgroundColor: active ? ACTIVE_BG : "transparent",
                    borderRadius: 8,
                    margin: "2px 8px",
                    textDecoration: "none",
                    fontSize: 14,
                    fontFamily: "Outfit, sans-serif",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = SIDEBAR_HOVER;
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span style={{ color: active ? ACTIVE_TEXT : ACCENT, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {isWide && <span>{item.name}</span>}
                </Link>
              </div>
            );
          })}
        </nav>

        {isWide && (
          <div style={{
            padding: "16px 20px",
            borderTop: `1px solid ${SIDEBAR_HOVER}`,
            color: TEXT_MUTED, fontSize: 14,
            fontFamily: "Outfit, sans-serif",
          }}>
            &copy; Theather Pleasantville
          </div>
        )}
      </aside>

      {isMobile && (
        <button
          onClick={() => setMobileOpen(p => !p)}
          style={{
            position: "fixed", top: 14, left: 14, zIndex: 1060,
            background: SIDEBAR_BG, border: "none", borderRadius: 8,
            padding: 8, color: TEXT_MAIN, cursor: "pointer",
            display: "flex", alignItems: "center",
          }}
        >
          <IconMenu />
        </button>
      )}
    </>
  );
}

export function useSidebarWidth() {
  const [width, setWidth] = useState(260);
  useEffect(() => {
  }, []);
  return width;
}