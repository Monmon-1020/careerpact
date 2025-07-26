import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { api } from '../api/client';
import { CheckCircle, Clock, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';

const ProgressManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const taskData = await api.getTasks();
      setTasks(taskData);
    } catch (error) {
      console.error('タスク読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completed = getTasksByStatus(TaskStatus.COMPLETED).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getTotalEstimatedHours = () => {
    return tasks.reduce((total, task) => total + task.estimated_hours, 0);
  };

  const getCompletedHours = () => {
    return getTasksByStatus(TaskStatus.COMPLETED)
      .reduce((total, task) => total + task.estimated_hours, 0);
  };

  const StatusCard: React.FC<{ 
    title: string; 
    count: number; 
    icon: React.ReactNode; 
    color: string;
    tasks: Task[];
  }> = ({ title, count, icon, color, tasks: statusTasks }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-gray-700">{count}</span>
      </div>
      
      {statusTasks.length > 0 && (
        <div className="space-y-2">
          {statusTasks.slice(0, 3).map(task => (
            <div key={task.id} className="text-sm text-gray-600 truncate">
              • {task.title}
            </div>
          ))}
          {statusTasks.length > 3 && (
            <div className="text-sm text-gray-500">
              +{statusTasks.length - 3}件の他のタスク
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedTasks = getTasksByStatus(TaskStatus.COMPLETED);
  const inProgressTasks = getTasksByStatus(TaskStatus.IN_PROGRESS);
  const pendingTasks = getTasksByStatus(TaskStatus.PENDING);
  const supportNeededTasks = getTasksByStatus(TaskStatus.SUPPORT_NEEDED);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">進捗管理</h2>
        <p className="text-gray-600">ビジュアルで分かりやすいチェックリスト/カンバンボード風の表示</p>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">完了率</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{getCompletionRate()}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionRate()}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">完了時間</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">{getCompletedHours()}h</div>
          <div className="text-sm text-gray-500">/ {getTotalEstimatedHours()}h</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">総タスク数</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">{tasks.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-800">要サポート</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{supportNeededTasks.length}</div>
        </div>
      </div>

      {/* ステータス別カード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatusCard
          title="未着手"
          count={pendingTasks.length}
          icon={<Calendar className="w-6 h-6 text-gray-500" />}
          color="border-gray-400"
          tasks={pendingTasks}
        />

        <StatusCard
          title="進行中"
          count={inProgressTasks.length}
          icon={<Clock className="w-6 h-6 text-blue-500" />}
          color="border-blue-400"
          tasks={inProgressTasks}
        />

        <StatusCard
          title="完了済み"
          count={completedTasks.length}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          color="border-green-400"
          tasks={completedTasks}
        />

        <StatusCard
          title="サポートが必要"
          count={supportNeededTasks.length}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
          color="border-yellow-400"
          tasks={supportNeededTasks}
        />
      </div>

      {/* 詳細リスト */}
      {tasks.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">全タスクリスト</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>期限: {new Date(task.deadline).toLocaleDateString('ja-JP')}</span>
                      <span>予想時間: {task.estimated_hours}h</span>
                      <span>優先度: {task.priority}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                      task.status === TaskStatus.SUPPORT_NEEDED ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === TaskStatus.COMPLETED ? '完了' :
                       task.status === TaskStatus.IN_PROGRESS ? '進行中' :
                       task.status === TaskStatus.SUPPORT_NEEDED ? 'サポート必要' :
                       '未着手'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">進捗を表示するタスクがありません</h3>
          <p className="text-gray-500">ダッシュボードでタスクを確認してください。</p>
        </div>
      )}
    </div>
  );
};

export default ProgressManagement;