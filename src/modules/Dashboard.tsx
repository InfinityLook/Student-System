import React from 'react';
import { ProfileSummaryCard } from './profile/ProfileSummaryCard';
import { PetWidget } from './pet/PetWidget';
import { ModuleLauncher } from './launcher/ModuleLauncher';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <ProfileSummaryCard />
      <PetWidget />
      <ModuleLauncher />
    </div>
  );
};
