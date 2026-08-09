import React from 'react';
import { Users, MessageSquare, Ghost } from 'lucide-react';

export const SocialView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studypilot-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-studypilot-accent" />
            Study Squads & Social
          </h3>
          <p className="text-sm text-gray-400">Sdílej svůj pokrok, chatuj s přáteli nebo aktivuj Ghost Mode.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-studypilot-primary" />
              Kampus Chat & Squad
            </h4>
            <span className="text-xs px-2.5 py-1 rounded-full bg-studypilot-success/20 text-studypilot-success">Aktivní</span>
          </div>
          <p className="text-xs text-gray-400">Tvá parta má aktuálně streak 5 dní. Pokračujte v jízdě!</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Ghost className="w-4 h-4 text-gray-400" />
              Ghost Mode
            </h4>
            <input type="checkbox" className="accent-studypilot-primary w-4 h-4 cursor-pointer" />
          </div>
          <p className="text-xs text-gray-400">Skryj svou aktivitu před ostatními a studuj v klidu.</p>
        </div>
      </div>
    </div>
  );
};
