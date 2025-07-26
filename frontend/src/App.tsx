import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, User, BarChart3, Award, Menu, X } from 'lucide-react';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ProgressManagement from './components/ProgressManagement';
import BadgeManagement from './components/BadgeManagement';
import { UserProfile } from './types';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'ダッシュボード', href: '/', icon: Home },
    { name: 'プロフィール設定', href: '/profile', icon: User },
    { name: '進捗管理', href: '/progress', icon: BarChart3 },
    { name: 'デジタルバッジ', href: '/badges', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-blue-600">CareerPact</h1>
                </div>
              </Link>
            </div>

            {/* デスクトップナビゲーション */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* モバイルメニューボタン */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* メインコンテンツ */}
      <main className="py-6">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Dashboard />
              </div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProfileForm />
              </div>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProgressManagement />
              </div>
            } 
          />
          <Route 
            path="/badges" 
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BadgeManagement />
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;