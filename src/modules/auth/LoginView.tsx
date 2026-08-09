import React from 'react';
import { useAppStore } from '../../store/useAppStore'; // Cesta k tvému storu
import { Zap } from 'lucide-react';

export const LoginView: React.FC = () => {
  const loginWithGoogle = useAppStore((state) => state.loginWithGoogle);

  const handleLogin = async () => {
    console.log("Kliknuto na tlačítko přihlášení!"); // PŘIDAL JSEM TOHLE
    await loginWithGoogle();
  };

  return (
    // ... zbytek kódu ...
    <button
      onClick={handleLogin} // TADY MUSÍ BÝT handleLogin
      className="w-full bg-white ..."
    >
      Pokračovat přes Gmail
    </button>
  );
};
