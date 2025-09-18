// src/components/SidebarMenu.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const menuData = [
  {
    title: "Búsquedas",
    icon: "🔎",
    subItems: [
      {
        title: "Internas",
        subItems: [
          { title: "Búsqueda Binaria", path: "/binary-search" },
          { title: "Búsqueda Secuencial", path: "/linear-search" },
          {
            title: "Funciones Hash",
            subItems: [
              { title: "MOD", path: "/hash-mod" },
              { title: "Cuadrada", path: "/hash-square" },
              { title: "Truncamiento", path: "/hash-trunc" },
              { title: "Plegamiento", path: "/hash-folding" },
            ],
          },
          { title: "Árboles Digitales", path: "/digital-trees" },
          { title: "Árboles por Residuo", path: "/residue-trees" },
          { title: "Árboles de Huffman", path: "/huffman-trees" },
        ],
      },
      {
        title: "Externas",
        subItems: [
          { title: "👉 Espacio reservado", path: "/extern-search" },
        ],
      },
    ],
  },
  {
    title: "Grafos",
    icon: "🕸️",
    subItems: [
      { title: "👉 Próximamente", path: "/graphs" },
    ],
  },
];

function SidebarMenu({ isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenu = (items, parentKey = "") =>
    items.map((item, index) => {
      const key = `${parentKey}-${index}`;
      const hasSubItems = item.subItems && item.subItems.length > 0;

      return (
        <div key={key} className="ml-2">
          <button
            onClick={() => hasSubItems && toggleSection(key)}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded hover:bg-[#1D6A96] transition"
          >
            <span>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.path ? (
                <Link to={item.path} onClick={onClose}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </span>
            {hasSubItems && <span>{openSections[key] ? "▼" : "▶"}</span>}
          </button>

          {/* Submenu */}
          {hasSubItems && openSections[key] && (
            <div className="ml-4 border-l border-gray-500 pl-2">
              {renderMenu(item.subItems, key)}
            </div>
          )}
        </div>
      );
    });

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-[#283B42] text-gray-200 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <h2 className="text-xl font-bold"> Menú</h2>
        <button onClick={onClose} className="text-2xl hover:text-red-400">
          ❌
        </button>
      </div>

      <nav className="p-4 space-y-2">{renderMenu(menuData)}</nav>
    </aside>
  );
}

export default SidebarMenu;
