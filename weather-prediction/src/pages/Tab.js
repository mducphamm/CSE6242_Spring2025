import React, { useState } from 'react';
import Tab1Content from './D3/D3';
import Tab2Content from './Tableau/Tableau';
import Tab3Content from './Model/Model';
import HomeContent from './Home/Home';
import DataContent from './Data/Data';
import MLContent from './ML/ML';
import './Tab.css';

const Tab = () => {
  // state for tracking which tab is currently shown
  const [activeTab, setActiveTab] = useState(0);
  // state for tracking animation direction
  const [slideDirection, setSlideDirection] = useState('');

  
  // config for our tab grid layout (2 rows x 3 columns)
  const tabsConfig = [
    { id: 0, name: "Home", row: 0, col: 0 },
    { id: 1, name: "Data", row: 0, col: 1 },
    { id: 2, name: "Methodology", row: 0, col: 2 },
    { id: 3, name: "D3", row: 1, col: 0 },
    { id: 4, name: "Tableau", row: 1, col: 1 },
    { id: 5, name: "‎ ‎ ‎ Prediction‎ ‎ ‎ ", row: 1, col: 2 }
  ];

  // figures out slide animation direction based on tab positions
  const handleTabChange = (index) => {
    const currentTab = tabsConfig.find(tab => tab.id === activeTab);
    const targetTab = tabsConfig.find(tab => tab.id === index);
    
    
    let direction;
    
    // horizontal movement
    if (currentTab.row === targetTab.row) {
      direction = targetTab.col > currentTab.col ? 'right-to-left' : 'left-to-right';
    } 
    
    // vertical movement
    else if (currentTab.col === targetTab.col) {
      direction = targetTab.row > currentTab.row ? 'top-to-bottom' : 'bottom-to-top';
    }
    
    // diagonal movement
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

  // calculates position styles for all tabs based on active tab
  const getSlideStyles = () => {
    const currentTab = tabsConfig.find(tab => tab.id === activeTab);
    const styles = [];
    
    // loop through all tabs to position them
    for (let i = 0; i < tabsConfig.length; i++) {
      const tab = tabsConfig[i];
      let transform = '';
      let transition = slideDirection ? 'transform 0.5s ease-in-out' : 'none';
      
      // first load has no animation
      if (!slideDirection || slideDirection === '') {
        
        transform = getTransformValue(tab, currentTab, 'none');
      } else {
        // use direction for animation
        transform = getTransformValue(tab, currentTab, slideDirection);
      }
      
      styles.push({
        transform,
        transition
      });
    }
    
    return styles;
  };
  
  // helper to calculate the css transform for positioning tabs
  const getTransformValue = (tab, currentTab, direction) => {
    // active tab is at origin
    if (tab.id === currentTab.id) {
      return 'translate(0, 0)';
    }
    
    // position other tabs based on their grid coordinates
    const xOffset = (tab.col - currentTab.col) * 100;
    const yOffset = (tab.row - currentTab.row) * 100;
    
    return `translate(${xOffset}%, ${yOffset}%)`;
  };

  // returns content for current tab
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

      {/* this is a content wrapper with sliding animation */}
      <div className="tab-content-wrapper">
        {/* makes a separate div for each tab content */}
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