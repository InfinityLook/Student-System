import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Zap } from 'lucide-react';

export const LoginView: React.FC = () => {
  const loginWithGoogle = useAppStore((state) => state.loginWithGoogle);

  return (
    <div className="min-h-screen bg-studypilot-bg flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-6 border border-studypilot-border relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studypilot-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-studypilot-primary to-studypilot-accent mx-auto flex items-center justify-center shadow-neon-purple">
          <Zap className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-wide">StudyPilot</h1>
          <p className="text-sm text-gray-400">Přihlas se pomocí svého Gmail účtu a pokračuj ve svém studijním pokroku.</p>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.3 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 11.7s.43 3.58 1.19 5.12l4.09-2.55z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.7 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Pokračovat přes Gmail</span>
        </button>

        <p className="text-[11px] text-gray-500">
          Přihlášením souhlasíš s ukládáním studijních dat do zabezpečeného lokálního úložiště.
        </p>
      </div>
    </div>
  );
};
