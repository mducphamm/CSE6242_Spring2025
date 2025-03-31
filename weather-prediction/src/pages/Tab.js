
import React, { useState } from 'react';
import Tab1Content from './D3/D3';
import Tab2Content from './Tableau/Tableau';
import Tab3Content from './Model/Model';

const Tab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');

  const tabs = ["D3", "Tableau", "Model"];

  
  const handleTabChange = (index) => {
    
    const direction = index > activeTab ? 'right-to-left' : 'left-to-right';
    setSlideDirection(direction);
    setActiveTab(index);
  };

  
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

  
  const getSlideStyles = () => {
    const positions = [];
    
    
    for (let i = 0; i < tabs.length; i++) {
      let transform;
      
      
      if (slideDirection === '') {
        transform = `translateX(${(i - activeTab) * 100}%)`;
      } else {
        transform = `translateX(${(i - activeTab) * 100}%)`;
      }
      
      positions.push({
        transform,
        transition: slideDirection ? 'transform 0.5s ease-in-out' : 'none',
      });
    }
    
    return positions;
  };

  return (
    <div className="tabs-container">
      <div className="site-header">
        <h1 className="header-title">CSE6242 TEAM 100</h1>
      </div>

      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content wrapper with sliding animation */}
      <div className="tab-content-wrapper">
        {/* Create a separate div for each tab content */}
        {tabs.map((_, index) => {
          const styles = getSlideStyles();
          return (
            <div 
              key={index}
              className="tab-content"
              style={styles[index]}
            >
              {index === 0 && <Tab1Content />}
              {index === 1 && <Tab2Content />}
              {index === 2 && <Tab3Content />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tab;