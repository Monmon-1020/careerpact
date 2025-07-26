import React, { useState, useEffect } from 'react';
import { DigitalBadge } from '../types';
import { api } from '../api/client';
import { Award, Calendar, Building, Download, ExternalLink } from 'lucide-react';

const BadgeManagement: React.FC = () => {
  const [badges, setBadges] = useState<DigitalBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const badgeData = await api.getBadges();
      setBadges(badgeData);
    } catch (error) {
      console.error('バッジ読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleBadge = async () => {
    const sampleBadge: DigitalBadge = {
      id: `badge_${Date.now()}`,
      title: "文章作成マスター",
      description: "商品説明文の作成タスクを完了し、高品質な文章を提供しました。",
      issued_date: new Date().toISOString(),
      issuer_company: "株式会社サンプル",
      task_id: "task_1"
    };

    try {
      await api.createBadge(sampleBadge);
      setBadges(prev => [...prev, sampleBadge]);
    } catch (error) {
      console.error('バッジ作成エラー:', error);
    }
  };

  const downloadBadgePDF = (badge: DigitalBadge) => {
    const pdfContent = `
      デジタルバッジ証明書
      
      バッジ名: ${badge.title}
      説明: ${badge.description}
      発行企業: ${badge.issuer_company}
      発行日: ${new Date(badge.issued_date).toLocaleDateString('ja-JP')}
      
      このバッジは、タスク完了の証明として発行されます。
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${badge.title}_証明書.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">報酬・認証機能</h2>
        <p className="text-gray-600">タスク完了後にデジタルバッジを受け取り、実績ページに保存できます</p>
      </div>

      {/* バッジ生成ボタン（デモ用） */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">デモ機能</h3>
        <p className="text-blue-600 mb-4">サンプルバッジを生成してテストできます</p>
        <button
          onClick={generateSampleBadge}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          サンプルバッジを生成
        </button>
      </div>

      {/* バッジ統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-800">獲得バッジ数</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{badges.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">連携企業数</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {new Set(badges.map(badge => badge.issuer_company)).size}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">今月の獲得</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {badges.filter(badge => {
              const badgeDate = new Date(badge.issued_date);
              const now = new Date();
              return badgeDate.getMonth() === now.getMonth() && 
                     badgeDate.getFullYear() === now.getFullYear();
            }).length}
          </div>
        </div>
      </div>

      {/* バッジ一覧 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">取得したデジタルバッジ</h3>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map(badge => (
              <div key={badge.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{badge.title}</h4>
                      <p className="text-sm text-gray-500">{badge.issuer_company}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {badge.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>発行日: {new Date(badge.issued_date).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadBadgePDF(badge)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    PDF送る
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    共有
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">まだバッジがありません</h3>
            <p className="text-gray-500 mb-4">タスクを完了すると、企業からデジタルバッジが発行されます。</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>完了通知</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>企業発行のデジタルバッジ ← 私がデザインしたからpdf送る</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>企業からのコメント（任意）</span>
              </div>
              <div className="mt-4 text-xs">
                <span>バッジは「実績」ページに保存</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 実績ページ説明 */}
      {badges.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">実績ページについて</h3>
          <p className="text-gray-600 mb-4">
            取得したデジタルバッジは自動的に実績ページに保存されます。
            これらのバッジは以下の用途でご活用いただけます：
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>復職時のポートフォリオとして活用</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>スキルアップの証明として履歴書に記載</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>自信とキャリア継続の実感を得る</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BadgeManagement;