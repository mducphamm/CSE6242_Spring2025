import React, { useState } from 'react';
import Tab1Content from './D3/D3';
import Tab2Content from './Tableau/Tableau';
import Tab3Content from './Model/Model';
import HomeContent from './Home/Home';
import DataContent from './Data/Data';
import MLContent from './ML/ML';
import './Tab.css';

const Tab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');

  
  const tabsConfig = [
    { id: 0, name: "Home", row: 0, col: 0 },
    { id: 1, name: "Data", row: 0, col: 1 },
    { id: 2, name: "Methodology", row: 0, col: 2 },
    { id: 3, name: "D3", row: 1, col: 0 },
    { id: 4, name: "Tableau", row: 1, col: 1 },
    { id: 5, name: "Linear Model", row: 1, col: 2 }
  ];

  const handleTabChange = (index) => {
    const currentTab = tabsConfig.find(tab => tab.id === activeTab);
    const targetTab = tabsConfig.find(tab => tab.id === index);
    
    
    let direction;
    
    
    if (currentTab.row === targetTab.row) {
      direction = targetTab.col > currentTab.col ? 'right-to-left' : 'left-to-right';
    } 
    
    else if (currentTab.col === targetTab.col) {
      direction = targetTab.row > currentTab.row ? 'top-to-bottom' : 'bottom-to-top';
    }
    
    else {
      
      if (targetTab.row > currentTab.row && targetTab.col > currentTab.col) {
        direction = 'topleft-to-bottomright';
      }
      
      else if (targetTab.row > currentTab.row && targetTab.col < currentTab.col) {
        direction = 'topright-to-bottomleft';
      }
      
      else if (targetTab.row < currentTab.row && targetTab.col > currentTab.col) {
        direction = 'bottomleft-to-topright';
      }
      
      else {
        direction = 'bottomright-to-topleft';
      }
    }
    
    setSlideDirection(direction);
    setActiveTab(index);
  };

  const getSlideStyles = () => {
    const currentTab = tabsConfig.find(tab => tab.id === activeTab);
    const styles = [];
    
    
    for (let i = 0; i < tabsConfig.length; i++) {
      const tab = tabsConfig[i];
      let transform = '';
      let transition = slideDirection ? 'transform 0.5s ease-in-out' : 'none';
      
      
      if (!slideDirection || slideDirection === '') {
        
        transform = getTransformValue(tab, currentTab, 'none');
      } else {
        
        transform = getTransformValue(tab, currentTab, slideDirection);
      }
      
      styles.push({
        transform,
        transition
      });
    }
    
    return styles;
  };
  
  const getTransformValue = (tab, currentTab, direction) => {
    
    if (tab.id === currentTab.id) {
      return 'translate(0, 0)';
    }
    
    
    const xOffset = (tab.col - currentTab.col) * 100;
    const yOffset = (tab.row - currentTab.row) * 100;
    
    return `translate(${xOffset}%, ${yOffset}%)`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <HomeContent />;
      case 1:
        return <DataContent />;
      case 2:
        return <MLContent />;
      case 3:
        return <Tab1Content />;
      case 4:
        return <Tab2Content />;
      case 5:
        return <Tab3Content />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="tabs-container">
      <div className="navigation-bar">
        <div className="title-container">
          <img src="/logo-left-mta.png" alt="Left Logo" className="nav-logo" />
          <h1 className="project-title">Weather Impact on NYC Subway Ridership</h1>
        </div>
        
        <div className="tabs-group-wrapper">
          {/* Project info tabs container */}
          <div className="tabs-group-container">
            <div className="tabs-group-label-top">Project Information</div>
            <div className="tabs">
              {tabsConfig.filter(tab => tab.row === 0).map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button-top ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive models tabs container */}
          <div className="tabs-group-container">
            <div className="tabs-group-label-bottom">Interactive Visuals</div>
            <div className="tabs">
              {tabsConfig.filter(tab => tab.row === 1).map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="title-container">
          <h1 className="header-title">CSE6242 TEAM 100</h1>
          <img src="/logo-right-gt.png" alt="Right Logo" className="nav-logo" />
        </div>
      </div>

      {/* Tab content wrapper with sliding animation */}
      <div className="tab-content-wrapper">
        {/* Create a separate div for each tab content */}
        {tabsConfig.map((tab) => {
          const styles = getSlideStyles();
          return (
            <div 
              key={tab.id}
              className="tab-content"
              style={styles[tab.id]}
            >
              {tab.id === 0 && <HomeContent />}
              {tab.id === 1 && <DataContent />}
              {tab.id === 2 && <MLContent />}
              {tab.id === 3 && <Tab1Content />}
              {tab.id === 4 && <Tab2Content />}
              {tab.id === 5 && <Tab3Content />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tab;