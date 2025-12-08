import React, { useMemo, useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import logo from "../../src/assets/ahadicon.png";
import Auth from "../OAuth/Auth";
import {
  House,
  Users,
  ChartLine,
  CalendarRange,
  UserPen,
  Award,
  UserRoundPen,
  Stamp,
  Settings,
  Warehouse,
  Paperclip,
  CircleQuestionMark,
  NotepadText,
  ArrowBigLeft,
} from "lucide-react";

export default function BurgerSidebar({ sidebarToggle, setSidebarToggle }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null); // Track open submenu
  const { role } = JSON.parse(localStorage.getItem("MERCHANT_DATA")) || {};

  const ALL_LINKS = [
    {
      to: "/",
      icon:
        role === "MERCHANT" ? (
          <House width={24} height={24} />
        ) : (
          <UserPen width={24} height={24} />
        ),
      label: role === "MERCHANT" ? "On Boarding" : "Lead",
      roles: role === "MERCHANT" ? ["MERCHANT"] : ["ADMIN"],
    },
    {
      to: "/settings",
      icon: <Settings width={24} height={24} />,
      label: "Settings",
      roles: ["MERCHANT"],
      children: [
        {
          to: "/settings/store-directory",
          icon: <Settings width={24} height={24} />,
          label: "Store Directory",
          roles: ["MERCHANT"],
        },
        {
          to: "/settings/user",
          icon: <Settings width={24} height={24} />,
          label: "User",
          roles: ["MERCHANT"],
        },
        {
          to: "/settings/product-category",
          icon: <Settings width={24} height={24} />,
          label: "Product Category",
          roles: ["MERCHANT"],
        },
      ],
    },
    {
      to: "/merchant-management",
      icon: <Warehouse width={24} height={24} />,
      label: "Merchant",
      roles: ["ADMIN"],
    },
    {
      to: "/approval-central",
      icon: <NotepadText width={24} height={24} />,
      label: "Approval Central",
      roles: ["ADMIN"],
    },
    ,
    {
      to: "/customer",
      icon: <Users width={24} height={24} />,
      label: "Customer",
      roles: ["MERCHANT", "ADMIN"],
    },
    {
      to: "/dashboard",
      icon: <House width={24} height={24} />,
      label: "Dashboard",
      roles: ["ADMIN", "MERCHANT"],
    },
    {
      to: "/analytics",
      icon: <ChartLine width={24} height={24} />,
      label: "Analytics",
      roles: ["MERCHANT"],
    },
    {
      to: "/promotion",
      icon: <CalendarRange width={24} height={24} />,
      label: "Promotion",
      roles: ["MERCHANT"],
      children: [
        {
          to: "/promotion/promotion",
          icon: <Settings width={24} height={24} />,
          label: "Promotion",
          roles: ["MERCHANT"],
        },
        {
          to: "/stamp/create",
          icon: <Settings width={24} height={24} />,
          label: "Stamp",
          roles: ["MERCHANT"],
        },
        {
          to: "/promotion/gamification",
          icon: <Settings width={24} height={24} />,
          label: "Gamification",
          roles: ["MERCHANT"],
        },

        {
          to: "/promotion/configuration",
          icon: <Settings width={24} height={24} />,
          label: "Game Configuration",
          roles: ["MERCHANT"],
        },
        {
          to: "/promotion/offer",
          icon: <Settings width={24} height={24} />,
          label: "Offer",
          roles: ["MERCHANT"],
        },
        {
          to: "/promotion/rewards",
          icon: <Settings width={24} height={24} />,
          label: "Rewards",
          roles: ["MERCHANT"],
        },
        {
          to: "/promotion/referral",
          icon: <Settings width={24} height={24} />,
          label: "Referral",
          roles: ["MERCHANT"],
        },
      ],
    },
    {
      to: "/supports",
      icon: <CircleQuestionMark width={24} height={24} />,
      label: "Supports",
      roles: ["MERCHANT"],
    },
    // {
    //   to: "/masters",
    //   icon: <Paperclip width={24} height={24} />,
    //   label: "Masters",
    //   roles: ["MERCHANT"],
    // },

    // {
    //   to: "/gamification",
    //   icon: <Award width={24} height={24} />,
    //   label: "Gamification",
    //   roles: ["MERCHANT"],
    // },
    // {
    //   to: "/staff",
    //   icon: <UserRoundPen width={24} height={24} />,
    //   label: "Staff",
    //   roles: ["MERCHANT"],
    // },
    // {
    //   to: "/stamp",
    //   icon: <Stamp width={24} height={24} />,
    //   label: "Digital Stamp",
    //   roles: ["MERCHANT"],
    // },
    {
      to: "/point-transactions",
      icon: <Stamp width={24} height={24} />,
      label: "Points & Transactions",
      roles: ["ADMIN"],
    },

    {
      to: "/Logout",
      icon: <ArrowBigLeft width={24} height={24} />,
      label: "Logout",
      roles: ["MERCHANT", "ADMIN"],
    },
  ];

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Get role from localStorage
  const role2 = useMemo(() => {
    try {
      const data = JSON.parse(localStorage.getItem("MERCHANT_DATA"));
      return data?.role || "";
    } catch {
      return "";
    }
  }, []);

  const navLinks = ALL_LINKS.filter((link) => link.roles.includes(role2));

  const closeSidebar = useCallback(
    (label) => {
      if (label === "Logout") {
        Auth.logout();
      }
      if (window.innerWidth < 768) setSidebarToggle(false);
    },
    [setSidebarToggle]
  );

  const toggleSubMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div>
      {sidebarToggle && (
        <aside className="font-sans fixed border-r border-primary top-0 left-0 w-full z-50 bg-primary shadow-md lg:w-64 h-screen overflow-y-auto">
          <div className="flex items-center justify-between p-[16.5px] border-b border-primary">
            <img src={logo} width={56} height={56} alt="logo" />

            {window.innerWidth < 768 && (
              <AiOutlineClose
                className="w-6 h-6 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => setSidebarToggle(false)}
              />
            )}
          </div>

          <nav className="space-y-3 p-4 text-gray-600">
            {navLinks.map((link) => (
              <div key={link.to}>
                {/* Parent Item */}
                {link.children ? (
                  // For links with children
                  <div
                    className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
                      isActive(link.to)
                        ? "bg-primary-light text-primary"
                        : "text-primary-white"
                    }`}
                    onClick={() => toggleSubMenu(link.label)}
                  >
                    <div className="flex items-center gap-2">
                      {link.icon}
                      <span className="font-inter font-medium text-[18px] leading-[100%]">
                        {link.label}
                      </span>
                    </div>
                    <span className="text-sm">
                      {openMenu === link.label ? "−" : "+"}
                    </span>
                  </div>
                ) : (
                  // For links without children
                  <Link
                    to={link.to}
                    className={`flex gap-2 items-center px-3 py-2 rounded ${
                      isActive(link.to)
                        ? "bg-primary-light text-primary"
                        : "text-primary-white"
                    }`}
                    onClick={() => closeSidebar(link.label)}
                  >
                    {link.icon}
                    <span className="font-inter font-medium text-[18px] leading-[100%]">
                      {link.label}
                    </span>
                  </Link>
                )}

                {/* Submenu Items */}
                {link.children && openMenu === link.label && (
                  <div className="ml-8 mt-1 space-y-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`block px-3 py-1 rounded text-sm ${
                          isActive(child.to)
                            ? "bg-primary-light text-primary"
                            : "text-primary-white hover:text-primary"
                        }`}
                        onClick={() => closeSidebar(child.label)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
