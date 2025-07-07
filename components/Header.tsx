
import React from 'react';

const MilkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h-8z" />
        <path d="M4 8h16l-1.6 11.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 8z" />
        <path d="M8 12h8" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center p-4">
        <MilkIcon />
        <h1 className="text-3xl md:text-4xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-200">
          Aplikasi Pencatatan Susu
        </h1>
      </div>
    </header>
  );
};

export default Header;
