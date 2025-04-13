import React, { useEffect } from 'react';
import './Tableau.css'

const Tableau = () => {
  useEffect(() => {
    
    const initTableau = () => {
      if (document.getElementById('viz1744574831008')) {
        const divElement = document.getElementById('viz1744574831008');
        const vizElement = divElement.getElementsByTagName('object')[0];
        
        if (vizElement) {
          vizElement.style.width = '1050px';
          vizElement.style.height = '825px';
          
          const scriptElement = document.createElement('script');
          scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
          vizElement.parentNode.insertBefore(scriptElement, vizElement);
        }
      }
    };

    const loadTableauScript = () => {
      if (!document.querySelector('script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        script.async = true;
        script.onload = initTableau;
        document.body.appendChild(script);
      } else {
        initTableau();
      }
    };
    
    setTimeout(loadTableauScript, 300);
    
    return () => {
      const scripts = document.querySelectorAll('script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className="fullscreen-tab-container">
      <h1>NYC Ridership & Weather Dashboard</h1>
      
      <div className="tableau-container">
        <div className="tableau-header">
          <div className="header-title">NYC Ridership & Weather Dashboard</div>
          <div className="header-controls">
            <div className="control-button"></div>
            <div className="control-button"></div>
            <div className="control-button"></div>
          </div>
        </div>
        
        <div className="tableau-body">
          <div className="main-visualization">
            <div className="viz-placeholder">
              <div className='tableauPlaceholder' id='viz1744574831008' style={{position: 'relative', width: '1000px', height: '800px', margin: '0 auto'}}>
                <noscript>
                  <a href='#'>
                    <img alt='Main Page' src='https://public.tableau.com/static/images/NY/NYCRidershipWeather/MainPage/1_rss.png' style={{border: 'none'}} />
                  </a>
                </noscript>
                <object className='tableauViz' style={{display: 'none'}}>
                  <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> 
                  <param name='embed_code_version' value='3' /> 
                  <param name='site_root' value='' />
                  <param name='name' value='NYCRidershipWeather/MainPage' />
                  <param name='tabs' value='no' />
                  <param name='toolbar' value='yes' />
                  <param name='static_image' value='https://public.tableau.com/static/images/NY/NYCRidershipWeather/MainPage/1.png' /> 
                  <param name='animate_transition' value='yes' />
                  <param name='display_static_image' value='yes' />
                  <param name='display_spinner' value='yes' />
                  <param name='display_overlay' value='yes' />
                  <param name='display_count' value='yes' />
                  <param name='language' value='en-US' />
                  <param name='filter' value='publish=yes' />
                </object>
              </div>
            </div>
          </div>
          
          <div className="dashboard-controls">
            <div className="control-section">
              <div className="control-title">About This Dashboard</div>
              <p style={{color: '#aaa', fontSize: '16px'}}>
                NOTICE!!! The tableau may not load properly if your screen is not of the proper size. If it is not, please click here to see it instead.
              </p>
              <p style={{color: '#aaa', fontSize: '14px'}}>
                This visualization shows the relationship between weather conditions and ridership patterns
                in New York City's transit system.
              </p>
            </div>
            <div className="control-section">
              <div className="control-title">Key Pages</div>
              <ul style={{color: '#aaa', fontSize: '14px', margin: '0', paddingLeft: '20px'}}>
                <li>Historical</li>
                <li>Weather</li>
                <li>Hoilday & Weekend</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tableau;