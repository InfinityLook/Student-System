import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const loginWithGoogle = useAppStore((state) => state.loginWithGoogle);
  const authError = useAppStore((state) => state.authError);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- Pozadí s moderními světelnými efekty (Ambient Glow) --- */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- Hlavní přihlašovací karta (Glassmorphism) --- */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col items-center text-center space-y-8">
          
          {/* Logo s neonovým efektem */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-75 animate-tilt"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>

          {/* Nadpis a popisek */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>StudyPilot OS v2.0</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Vítej zpět
            </h1>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Přihlas se svým Gmail účtem a spravuj svůj studijní pokrok, úkoly a odměny na jednom místě.
            </p>
          </div>

          {/* Přihlašovací tlačítko Google */}
          <button
            onClick={loginWithGoogle}
            className="w-full group relative inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer"
          >
            {/* Google ikona */}
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
            <span className="text-sm font-bold">Pokračovat přes Gmail</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {authError && (
            <p className="text-xs text-red-400 -mt-4">{authError}</p>
          )}

          {/* Bezpečnostní popisek dole */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/5 w-full justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zabezpečené šifrované přihlášení</span>
          </div>

        </div>
      </div>

    </div>
  );
};
