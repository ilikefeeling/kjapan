import React from 'react';
import { Home, Map, BookOpen, UserCheck } from 'lucide-react';

export type NavTab = 'home' | 'map' | 'manual' | 'pass';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: '홈', icon: Home },
    { id: 'map' as NavTab, label: '오프라인 지도', icon: Map },
    { id: 'manual' as NavTab, label: '행동 요령', icon: BookOpen },
    { id: 'pass' as NavTab, label: '내 패스', icon: UserCheck }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-[76px] bg-white border-t border-[#c5c6cd]/40 z-40 flex justify-around items-center px-2 pb-2 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#e02928] font-black scale-105'
                : 'text-[#45474c] font-bold hover:text-gray-900'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px] mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
