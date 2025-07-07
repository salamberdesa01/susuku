import React from 'react';

type MobileView = 'home' | 'add' | 'manage';

interface BottomNavigationProps {
  activeView: MobileView;
  setActiveView: (view: MobileView) => void;
}

const HomeIcon: React.FC<{isActive: boolean}> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const AddIcon: React.FC<{isActive: boolean}> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ManageIcon: React.FC<{isActive: boolean}> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);


const NavButton: React.FC<{
    label: string;
    view: MobileView;
    activeView: MobileView;
    onClick: (view: MobileView) => void;
    children: React.ReactNode;
}> = ({ label, view, activeView, onClick, children }) => {
    const isActive = view === activeView;
    return (
        <button onClick={() => onClick(view)} className="flex flex-col items-center justify-center text-xs w-full pt-2 pb-1 focus:outline-none focus:bg-slate-700/50 group">
            {children}
            <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>{label}</span>
        </button>
    );
};


const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 flex justify-around items-start z-20">
      <NavButton label="Beranda" view="home" activeView={activeView} onClick={setActiveView}>
        <HomeIcon isActive={activeView === 'home'} />
      </NavButton>
      <NavButton label="Tambah" view="add" activeView={activeView} onClick={setActiveView}>
        <AddIcon isActive={activeView === 'add'} />
      </NavButton>
      <NavButton label="Kelola" view="manage" activeView={activeView} onClick={setActiveView}>
        <ManageIcon isActive={activeView === 'manage'} />
      </NavButton>
    </nav>
  );
};

export default BottomNavigation;
