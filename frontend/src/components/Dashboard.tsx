import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { api } from '../api/client';
import { Clock, Calendar, Star, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
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

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await api.updateTaskStatus(taskId, status);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="w-5 h-5 text-blue-500" />;
      case TaskStatus.SUPPORT_NEEDED:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return '未着手';
      case TaskStatus.IN_PROGRESS:
        return '進行中';
      case TaskStatus.COMPLETED:
        return '完了済み';
      case TaskStatus.SUPPORT_NEEDED:
        return 'サポートが必要';
      default:
        return '不明';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'text-red-600 bg-red-100';
      case 2:
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ダッシュボード</h2>
        <p className="text-gray-600">AIが自動生成したタスクリスト（To Do）</p>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    優先度 {task.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>期限: {new Date(task.deadline).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>予想: {task.estimated_hours}時間</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span>スキル: {task.required_skills.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span>{getStatusText(task.status)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {task.status === TaskStatus.PENDING && (
                <button
                  onClick={() => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  開始する
                </button>
              )}
              
              {task.status === TaskStatus.IN_PROGRESS && (
                <>
                  <button
                    onClick={() => updateTaskStatus(task.id, TaskStatus.COMPLETED)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    完了
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task.id, TaskStatus.SUPPORT_NEEDED)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                  >
                    サポートが必要
                  </button>
                </>
              )}

              {task.status === TaskStatus.SUPPORT_NEEDED && (
                <button
                  onClick={() => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  再開する
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">まだタスクがありません</h3>
          <p className="text-gray-500">プロフィールを設定すると、AIがあなたに適したタスクを提案します。</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;