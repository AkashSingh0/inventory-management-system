import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <AppRoutes />
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
