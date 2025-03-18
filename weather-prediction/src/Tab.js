import React, { useState } from 'react';
import Tab1Content from './D3';
import Tab2Content from './Tableau';
import Tab3Content from './Model';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Tab 1", "Tab 2", "Tab 3"];

  // Function to render the correct content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Tab1Content />;
      case 1:
        return <Tab2Content />;
      case 2:
        return <Tab3Content />;
      default:
        return <Tab1Content />;
    }
  };

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)} // Change active tab
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render the content based on activeTab */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      <style jsx>{`
        .tabs {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .tab-button {
          padding: 10px 20px;
          cursor: pointer;
          border: 1px solid #ccc;
          background-color: #f1f1f1;
          border-radius: 5px 5px 0 0;
        }
        .tab-button.active {
          background-color: #4CAF50;
          color: white;
        }
        .tab-button:hover {
          background-color: #ddd;
        }
        .tab-content {
          padding: 20px;
          border: 1px solid #ccc;
          border-top: none;
          background-color: #f9f9f9;
          border-radius: 0 0 5px 5px;
        }
      `}</style>
    </div>
  );
};

export default Tabs;