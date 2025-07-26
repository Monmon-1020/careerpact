import React, { useState, useEffect } from 'react';
import { UserProfile, SkillType, ContactMethod } from '../types';
import { api } from '../api/client';
import { Edit, Save, X } from 'lucide-react';

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    available_days: [],
    available_time_slots: [],
    weekly_hours: 0,
    skills: [],
    preferred_contact: ContactMethod.EMAIL
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const days = [
    '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'
  ];

  const timeSlots = [
    '朝（6:00-12:00）', '午後（12:00-18:00）', '夜（18:00-24:00）', '深夜（24:00-6:00）'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const existingProfile = await api.getCurrentProfile();
      if (existingProfile) {
        setProfile(existingProfile);
        setOriginalProfile(existingProfile);
        setHasProfile(true);
      } else {
        setIsEditing(true); // 新規作成の場合は編集モード
      }
    } catch (error) {
      console.error('プロフィール読み込みエラー:', error);
      setIsEditing(true); // エラーの場合も編集モード
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day: string, checked: boolean) => {
    if (!isEditing) return;
    setProfile(prev => ({
      ...prev,
      available_days: checked 
        ? [...prev.available_days, day]
        : prev.available_days.filter(d => d !== day)
    }));
  };

  const handleTimeSlotChange = (slot: string, checked: boolean) => {
    if (!isEditing) return;
    setProfile(prev => ({
      ...prev,
      available_time_slots: checked
        ? [...prev.available_time_slots, slot]
        : prev.available_time_slots.filter(s => s !== slot)
    }));
  };

  const handleSkillChange = (skill: SkillType, checked: boolean) => {
    if (!isEditing) return;
    setProfile(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveProfile(profile);
      setOriginalProfile(profile);
      setHasProfile(true);
      setIsEditing(false);
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading && !isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {hasProfile ? 'プロフィール設定' : '基本情報・希望条件の入力'}
        </h2>
        {hasProfile && !isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            編集
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            働ける曜日
          </label>
          <div className="grid grid-cols-2 gap-2">
            {days.map(day => (
              <label key={day} className={`flex items-center ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={profile.available_days.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className={!isEditing && profile.available_days.includes(day) ? 'text-blue-600 font-medium' : ''}>
                  {day}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            働ける時間帯
          </label>
          <div className="space-y-2">
            {timeSlots.map(slot => (
              <label key={slot} className={`flex items-center ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={profile.available_time_slots.includes(slot)}
                  onChange={(e) => handleTimeSlotChange(slot, e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className={!isEditing && profile.available_time_slots.includes(slot) ? 'text-blue-600 font-medium' : ''}>
                  {slot}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="weekly_hours" className="block text-sm font-medium text-gray-700 mb-2">
            週の稼働可能時間
          </label>
          <input
            type="number"
            id="weekly_hours"
            min="1"
            max="40"
            value={profile.weekly_hours}
            onChange={(e) => setProfile(prev => ({ ...prev, weekly_hours: parseInt(e.target.value) || 0 }))}
            disabled={!isEditing}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? 'bg-gray-50 cursor-default' : ''
            }`}
            placeholder="例: 10"
          />
          <p className="text-sm text-gray-500 mt-1">時間/週</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            やりたい仕事の種類
          </label>
          <div className="space-y-2">
            {Object.values(SkillType).map(skill => (
              <label key={skill} className={`flex items-center ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={profile.skills.includes(skill)}
                  onChange={(e) => handleSkillChange(skill, e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className={!isEditing && profile.skills.includes(skill) ? 'text-blue-600 font-medium' : ''}>
                  {skill}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="contact_method" className="block text-sm font-medium text-gray-700 mb-2">
            希望する連絡方法
          </label>
          <select
            id="contact_method"
            value={profile.preferred_contact}
            onChange={(e) => setProfile(prev => ({ ...prev, preferred_contact: e.target.value as ContactMethod }))}
            disabled={!isEditing}
            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? 'bg-gray-50 cursor-default' : ''
            }`}
          >
            {Object.values(ContactMethod).map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? '保存中...' : 'プロフィールを保存'}
            </button>
            {hasProfile && (
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                キャンセル
              </button>
            )}
          </div>
        )}

        {!isEditing && hasProfile && (
          <div className="text-center text-sm text-gray-500">
            プロフィールが保存されています。変更するには「編集」ボタンをクリックしてください。
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;