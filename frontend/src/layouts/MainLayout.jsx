import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReportModal from '../components/ReportModal';
import { useLookups } from '../hooks/useLookups';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState('lost');
  const { categories, locations } = useLookups();
  const { user } = useAuth();

  const openModal = (type) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setReportType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 font-body">
      <Header onReportClick={() => openModal('lost')} />
      <Outlet context={{ openModal, categories, locations }} />
      <Footer />
      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={reportType}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}
