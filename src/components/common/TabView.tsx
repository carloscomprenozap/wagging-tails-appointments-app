
import React, { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  title: string;
  content: ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultActiveTab?: string;
}

const TabView: React.FC<TabViewProps> = ({ tabs, defaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id);
  
  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-petblue-DEFAULT border-b-2 border-petblue-DEFAULT'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabView;
