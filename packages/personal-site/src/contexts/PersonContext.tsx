import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPersonInfo } from '@/services/person';
import { getAvatar } from '@/services/common';
import { AboutMeData } from '@/lib/aboutTypes';
import { mapApiToAboutMeData } from '@/utils/aboutDataMapper';

interface PersonContextType {
  personInfo: AboutMeData | null;
  avatarUrl: string | null;
  loading: boolean;
  error: string | null;
  refreshPersonInfo: () => Promise<void>;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export const usePerson = () => {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error('usePerson must be used within a PersonProvider');
  }
  return context;
};

export const PersonProvider = ({ children }: { children: ReactNode }) => {
  const [personInfo, setPersonInfo] = useState<AboutMeData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvatarUrl = async () => {
    try {
      const res = await getAvatar();
      if (res && res.data && res.data.avatar) {
        setAvatarUrl(res.data.avatar);
      } else {
        setAvatarUrl("/avatar.png");
      }
    } catch (error) {
      setAvatarUrl("/avatar.png");
    }
  };

  const refreshPersonInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPersonInfo();

      if (response.code === 200 && response.data && response.data.length > 0) {
        const mappedData = mapApiToAboutMeData(response.data[0]);
        setPersonInfo(mappedData);
      } else {
        setError(response.msg || '获取个人信息失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取个人信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPersonInfo();
    fetchAvatarUrl();
  }, []);

  const value = {
    personInfo,
    avatarUrl,
    loading,
    error,
    refreshPersonInfo,
  };

  return <PersonContext.Provider value={value}>{children}</PersonContext.Provider>;
};