import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 z-50">
      <div className="relative max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-between items-center py-3">
          {/* Accueil */}
          <li>
            <Link
              to="/"
              className="relative flex flex-col items-center group"
            >
              <div className="p-3 rounded-full bg-yellow-500 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-house text-white"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              </div>
              <span className="mt-1 text-xs font-medium text-yellow-200">
                Accueil
              </span>
            </Link>
          </li>

          {/* Produits */}
          <li>
            <Link
              to="/products"
              className="relative flex flex-col items-center group"
            >
              <div className="p-3 rounded-full bg-yellow-700/20 backdrop-blur-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-bag text-yellow-200"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="mt-1 text-xs font-medium text-yellow-300">
                Produits
              </span>
            </Link>
          </li>

          {/* Contact */}
          <li>
            <Link
              to="/contact"
              className="relative flex flex-col items-center group"
            >
              <div className="p-3 rounded-full bg-yellow-700/20 backdrop-blur-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail text-yellow-200"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <span className="mt-1 text-xs font-medium text-yellow-300">
                Contact
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
