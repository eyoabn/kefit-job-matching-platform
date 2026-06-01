import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-kefit-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-kefit-secondary font-bold text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-kefit-primary">Kefit</h1>
        </Link>
        {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        {children}
      </div>

      <footer className="mt-8 text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Kefit. All rights reserved.
      </footer>
    </div>
  );
};
