// app/components/Navigation.js
"use client";

import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '../app/context/AuthContext';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-customGreen shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image 
              src="/image.png" 
              alt="Logo" 
              width={60} 
              height={60} 
              className="mr-4"
            />
            {/* Uncomment below if you want a textual logo */}
            {/* <Link href="/" className="text-2xl font-bold text-white">
              LUCCA
            </Link> */}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-white">
                  Welcome, {user?.username || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="bg-white text-[#0C573C] px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-white text-[#0C573C] px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Login
              </Link>
            
            
            )
            }
          {isAuthenticated && user.isAdmin && (
            <Link href="/admin" className="text-white">
              Admin
            </Link>
          )}
                    </div>
        </div>
      </div>
    </nav>
  );
}
