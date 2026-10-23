'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import AlertReportModal from '@/components/modals/AlertReportModal';
import AIAssistantModal from '@/components/ai/AIAssistantModal';
import GamificationModal from '@/components/badges/GamificationModal';
import AuthModal from '@/components/modals/AuthModal';
import LogoutConfirmModal from '@/components/modals/LogoutConfirmModal';
import FavoriteAuthPromptModal from '@/components/modals/FavoriteAuthPromptModal';
import { useRouter } from 'next/navigation';

export default function GlobalModals() {
  const { activeModal } = useApp();
  const router = useRouter();

  if (!activeModal.type) return null;

  return (
    <>
      {activeModal.type === 'alert_report' && <AlertReportModal />}
      {activeModal.type === 'ai_assistant' && <AIAssistantModal initialQuery={activeModal.data?.query} />}
      {activeModal.type === 'badges' && <GamificationModal />}
      {activeModal.type === 'auth' && (
        <AuthModal onAdminNavigate={() => router.push('/admin')} />
      )}
      {activeModal.type === 'logout_confirm' && <LogoutConfirmModal />}
      {activeModal.type === 'auth_required_favorite' && <FavoriteAuthPromptModal />}
    </>
  );
}
