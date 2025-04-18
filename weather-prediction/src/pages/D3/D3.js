import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';
import './D3.css';

const D3 = () => {
  const [data, setData] = useState([]);
  const [tempBinData, setTempBinData] = useState([]);
  const [precipBinData, setPrecipBinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('temperature'); 
  const [dayType, setDayType] = useState('all'); 
  const [holidayType, setHolidayType] = useState('all'); 
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("Loading...");
  
  const scatterChartRef = useRef(null);
  const tempChartRef = useRef(null);
  const precipChartRef = useRef(null);
  
  
  const colors = {
    background: '#1e1e1e',
    text: '#f5f5f5',
    accent: '#007FFF',
    secondary: '#81C784',
    bars: '#007FFF',
    scatter: '#81C784',
    grid: '#444',
    tooltip: '#333',
    weekend: '#FF9800',
    weekday: '#2196F3',
    holiday: '#E91E63'  
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const sampleData = [
          { date: "2023-01-01", temperature_2m_mean: 35.2, precipitation_sum: 0, ridership: 3200000, weekend: 1, is_holiday: 1, holidayName: "New Year's Day" },
          { date: "2023-01-02", temperature_2m_mean: 40.5, precipitation_sum: 0.05, ridership: 4800000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-03", temperature_2m_mean: 42.3, precipitation_sum: 0.2, ridership: 4900000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-04", temperature_2m_mean: 39.8, precipitation_sum: 0, ridership: 4850000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-05", temperature_2m_mean: 41.2, precipitation_sum: 0, ridership: 5000000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-06", temperature_2m_mean: 43.7, precipitation_sum: 0, ridership: 5100000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-07", temperature_2m_mean: 44.6, precipitation_sum: 0.1, ridership: 3500000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-01-08", temperature_2m_mean: 45.2, precipitation_sum: 0.3, ridership: 3300000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-01-09", temperature_2m_mean: 48.1, precipitation_sum: 0, ridership: 4950000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-10", temperature_2m_mean: 52.3, precipitation_sum: 0, ridership: 5050000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-11", temperature_2m_mean: 55.1, precipitation_sum: 0, ridership: 5200000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-12", temperature_2m_mean: 57.8, precipitation_sum: 0, ridership: 5250000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-13", temperature_2m_mean: 58.2, precipitation_sum: 0, ridership: 5300000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-14", temperature_2m_mean: 59.1, precipitation_sum: 0, ridership: 3800000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-01-15", temperature_2m_mean: 61.5, precipitation_sum: 0.15, ridership: 3700000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-01-16", temperature_2m_mean: 65.2, precipitation_sum: 0, ridership: 5100000, weekend: 0, is_holiday: 1, holidayName: "Martin Luther King Jr. Day" },
          { date: "2023-01-17", temperature_2m_mean: 68.7, precipitation_sum: 0, ridership: 5050000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-18", temperature_2m_mean: 72.3, precipitation_sum: 0, ridership: 4900000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-19", temperature_2m_mean: 75.8, precipitation_sum: 0, ridership: 4850000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-20", temperature_2m_mean: 79.1, precipitation_sum: 0, ridership: 4800000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-01-21", temperature_2m_mean: 80.5, precipitation_sum: 0, ridership: 3650000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-01-22", temperature_2m_mean: 82.1, precipitation_sum: 0.7, ridership: 3400000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-02-01", temperature_2m_mean: 30.2, precipitation_sum: 0.5, ridership: 4600000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-02-05", temperature_2m_mean: 22.6, precipitation_sum: 0.8, ridership: 3100000, weekend: 1, is_holiday: 0, holidayName: "" },
          { date: "2023-02-15", temperature_2m_mean: 50.5, precipitation_sum: 0, ridership: 5200000, weekend: 0, is_holiday: 0, holidayName: "" },
          { date: "2023-02-20", temperature_2m_mean: 62.3, precipitation_sum: 0, ridership: 3850000, weekend: 0, is_holiday: 1, holidayName: "Presidents' Day" }
        ];        
        
        let parsedData;
        let fileContent;
        
        
        const possiblePaths = [
          './joined_data_holi.csv',
          'joined_data_holi.csv',
          '/d3/joined_data_holi.csv',
          '../joined_data_holi.csv',
          'data/joined_data_holi.csv'
        ];
        
        let fetchSucceeded = false;
        
        for (const path of possiblePaths) {
          try {
            console.log(`Attempting to fetch from: ${path}`);
            const response = await fetch(path);
            if (!response.ok) {
              console.log(`Failed to fetch from ${path}: ${response.status} ${response.statusText}`);
              continue;
            }
            
            fileContent = await response.text();
            console.log(`Successfully loaded CSV from: ${path}`);
            console.log(`First 100 chars: ${fileContent.slice(0, 1000)}`);
            fetchSucceeded = true;
            setDataSource(`Real data from ${path}`);
            break;
          } catch (fetchError) {
            console.warn(`Error fetching from ${path}:`, fetchError);
          }
        }
        
        
        if (!fetchSucceeded && typeof window !== 'undefined' && window.fs && window.fs.readFile) {
          try {
            console.log("Falling back to window.fs.readFile API");
            const response = await window.fs.readFile('joined_data.csv');
            fileContent = new TextDecoder().decode(response);
            console.log("Successfully loaded CSV with window.fs.readFile");
            fetchSucceeded = true;
            setDataSource("Real data via window.fs API");
          } catch (fsError) {
            console.warn("window.fs.readFile fallback failed:", fsError);
          }
        }
        
        
        if (fetchSucceeded && fileContent) {
          try {
            parsedData = Papa.parse(fileContent, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true
            }).data;
            
            console.log("CSV parsed successfully, row count:", parsedData.length);
          } catch (parseError) {
            console.error("Error parsing CSV:", parseError);
            setError(`Failed to parse CSV data: ${parseError.message}`);
            parsedData = sampleData;
            setDataSource("Sample data (parse error)");
          }
        } else {
          console.warn("All loading attempts failed, using sample data");
          parsedData = sampleData;
          setDataSource("Sample data (couldn't load CSV)");
        }
        
        console.log("Parsed data sample:", parsedData.slice(0, 3));
        
        
        const cleanData = parsedData
          .filter(row => 
            row.temperature_2m_mean != null && 
            row.precipitation_sum != null && 
            row.ridership != null
          )
          .map(row => ({
            date: row.date,
            temperature: row.temperature_2m_mean,
            precipitation: row.precipitation_sum,
            ridership: row.ridership,
            weekend: row.weekend === 1 || row.weekend === true,
            holiday: row.is_holiday === 1 || row.is_holiday === true,
            holidayName: row.holidayName || "",
            temperatureBin: Math.floor(row.temperature_2m_mean / 10) * 10
          }));
        
        console.log("Clean data sample:", cleanData.slice(0, 3));
        console.log("Total clean data points:", cleanData.length);
        
        if (cleanData.length === 0) {
          setError("No valid data points found after filtering");
          setLoading(false);
          return;
        }
        
        setData(cleanData);
        
        
        const ridershipByTemperature = {};
        cleanData.forEach(row => {
          
          if ((holidayType === 'holiday' && !row.holiday) || 
              (holidayType === 'non-holiday' && row.holiday)) {
            return;
          }
          
          
          if ((dayType === 'weekday' && row.weekend) || 
              (dayType === 'weekend' && !row.weekend)) {
            return;
          }
          
          const bin = row.temperatureBin;
          if (!ridershipByTemperature[bin]) {
            ridershipByTemperature[bin] = {
              sum: 0,
              count: 0,
              weekday: { sum: 0, count: 0 },
              weekend: { sum: 0, count: 0 },
              holiday: { sum: 0, count: 0 },
              nonHoliday: { sum: 0, count: 0 }
            };
          }
          
          ridershipByTemperature[bin].sum += row.ridership;
          ridershipByTemperature[bin].count += 1;
          
          if (row.weekend) {
            ridershipByTemperature[bin].weekend.sum += row.ridership;
            ridershipByTemperature[bin].weekend.count += 1;
          } else {
            ridershipByTemperature[bin].weekday.sum += row.ridership;
            ridershipByTemperature[bin].weekday.count += 1;
          }
          
          if (row.holiday) {
            ridershipByTemperature[bin].holiday.sum += row.ridership;
            ridershipByTemperature[bin].holiday.count += 1;
          } else {
            ridershipByTemperature[bin].nonHoliday.sum += row.ridership;
            ridershipByTemperature[bin].nonHoliday.count += 1;
          }
        });
        
        const tempData = Object.keys(ridershipByTemperature).map(bin => {
          const data = ridershipByTemperature[bin];
          return {
            temperatureBin: parseInt(bin),
            temperatureLabel: `${bin}°F - ${parseInt(bin) + 9}°F`,
            averageRidership: data.sum / data.count,
            weekdayRidership: data.weekday.count > 0 ? data.weekday.sum / data.weekday.count : 0,
            weekendRidership: data.weekend.count > 0 ? data.weekend.sum / data.weekend.count : 0,
            holidayRidership: data.holiday.count > 0 ? data.holiday.sum / data.holiday.count : 0,
            nonHolidayRidership: data.nonHoliday.count > 0 ? data.nonHoliday.sum / data.nonHoliday.count : 0,
            count: data.count
          };
        }).sort((a, b) => a.temperatureBin - b.temperatureBin);
        
        console.log("Temperature bin data:", tempData);
        
        setTempBinData(tempData);
        
        
        const precipitationBins = [
          {min: 0, max: 0, label: "No Rain"},
          {min: 0.01, max: 0.1, label: "Light Rain"},
          {min: 0.1, max: 0.5, label: "Moderate Rain"},
          {min: 0.5, max: 100, label: "Heavy Rain"}
        ];
        
        const getPrecipitationBin = (value) => {
          for (const bin of precipitationBins) {
            if (value >= bin.min && value <= bin.max) {
              return bin.label;
            }
          }
          return "Unknown";
        };
        
        const cleanDataWithPrecipBin = cleanData.map(row => ({
          ...row,
          precipitationBin: getPrecipitationBin(row.precipitation)
        }));
        
        const ridershipByPrecipitation = {};
        cleanDataWithPrecipBin.forEach(row => {
          
          if ((holidayType === 'holiday' && !row.holiday) || 
              (holidayType === 'non-holiday' && row.holiday)) {
            return;
          }
          
          
          if ((dayType === 'weekday' && row.weekend) || 
              (dayType === 'weekend' && !row.weekend)) {
            return;
          }
          
          const bin = row.precipitationBin;
          if (!ridershipByPrecipitation[bin]) {
            ridershipByPrecipitation[bin] = {
              sum: 0,
              count: 0,
              weekday: { sum: 0, count: 0 },
              weekend: { sum: 0, count: 0 },
              holiday: { sum: 0, count: 0 },
              nonHoliday: { sum: 0, count: 0 }
            };
          }
          
          ridershipByPrecipitation[bin].sum += row.ridership;
          ridershipByPrecipitation[bin].count += 1;
          
          if (row.weekend) {
            ridershipByPrecipitation[bin].weekend.sum += row.ridership;
            ridershipByPrecipitation[bin].weekend.count += 1;
          } else {
            ridershipByPrecipitation[bin].weekday.sum += row.ridership;
            ridershipByPrecipitation[bin].weekday.count += 1;
          }
          
          if (row.holiday) {
            ridershipByPrecipitation[bin].holiday.sum += row.ridership;
            ridershipByPrecipitation[bin].holiday.count += 1;
          } else {
            ridershipByPrecipitation[bin].nonHoliday.sum += row.ridership;
            ridershipByPrecipitation[bin].nonHoliday.count += 1;
          }
        });
        const precipData = Object.keys(ridershipByPrecipitation)
          .filter(bin => bin !== "Unknown")
          .map(bin => {
            const data = ridershipByPrecipitation[bin];
            return {
              precipitationBin: bin,
              averageRidership: data.sum / data.count,
              weekdayRidership: data.weekday.count > 0 ? data.weekday.sum / data.weekday.count : 0,
              weekendRidership: data.weekend.count > 0 ? data.weekend.sum / data.weekend.count : 0,
              holidayRidership: data.holiday.count > 0 ? data.holiday.sum / data.holiday.count : 0,
              nonHolidayRidership: data.nonHoliday.count > 0 ? data.nonHoliday.sum / data.nonHoliday.count : 0,
              count: data.count
            };
          });

        const order = {
          "No Rain": 1,
          "Light Rain": 2,
          "Moderate Rain": 3,
          "Heavy Rain": 4
        };
        
        precipData.sort((a, b) => order[a.precipitationBin] - order[b.precipitationBin]);
        
        console.log("Precipitation bin data:", precipData);
        
        setPrecipBinData(precipData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading or processing data:", error);
        setError(`Error loading data: ${error.message}`);
        setDataSource("Error");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [holidayType]); 

useEffect(() => {
  if (tempBinData.length === 0 || !tempChartRef.current || view !== 'temperature') return;
  
  
  const margin = { top: 40, right: 30, bottom: 80, left: 80 };
  const width = tempChartRef.current.clientWidth || 800;
  const adjustedWidth = width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  
  const chartData = tempBinData.map(d => {
    let value;
    if (dayType === 'weekday') {
      value = d.weekdayRidership;
    } else if (dayType === 'weekend') {
      value = d.weekendRidership;
    } else if (holidayType === 'holiday') {
      value = d.holidayRidership;
    } else if (holidayType === 'non-holiday') {
      value = d.nonHolidayRidership;
    } else {
      value = d.averageRidership;
    }
    return {
      ...d,
      value
    };
  });
  
  
  const x = d3.scaleBand()
    .domain(chartData.map(d => d.temperatureLabel))
    .range([0, adjustedWidth])
    .padding(0.3);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.value) * 1.1])
    .range([height, 0]);
  
  
  let svg = d3.select(tempChartRef.current).select("svg");
  let isInitialRender = svg.empty();
  
  if (isInitialRender) {
    
    svg = d3.select(tempChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", colors.text);
    
    
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
            .tickFormat(d => d3.format(",.0f")(d / 1000) + "k"))
      .style("fill", colors.text);
    
    
    svg.append("text")
      .attr("class", "x-title")
      .attr("transform", `translate(${adjustedWidth/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("fill", colors.text)
      .text("Temperature Range");
    
    
    svg.append("text")
      .attr("class", "y-title")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", colors.text)
      .text("Average Ridership");
    
    
    const titleText = getTitleText('temperature');
    
    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", adjustedWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("fill", colors.accent)
      .text(titleText);
    
    
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
            .tickSize(-adjustedWidth)
            .tickFormat("")
      )
      .style("stroke", colors.grid)
      .style("opacity", 0.3);
    
    
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", colors.tooltip)
      .style("border", "1px solid #555")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
      .style("pointer-events", "none")
      .style("z-index", "10");
    
    
    svg.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.temperatureLabel))
      .attr("width", x.bandwidth())
      .attr("y", height) 
      .attr("height", 0) 
      .attr("fill", colors.bars)
      .attr("rx", 4)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d3.color(colors.accent).brighter(0.5));
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`
          <strong>Temperature: ${d.temperatureLabel}</strong><br/>
          Average Ridership: ${d3.format(",.0f")(d.value)}<br/>
          Sample size: ${d.count} days
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", colors.bars);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition() 
      .duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    svg.selectAll(".bar-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.temperatureLabel) + x.bandwidth() / 2)
      .attr("y", height) 
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-size", "10px")
      .style("opacity", 0) 
      .text(d => d3.format(",.0f")(d.value / 1000) + "k")
      .transition() 
      .duration(800)
      .style("opacity", 1)
      .attr("y", d => y(d.value) - 5);
  } else {
    
    svg = d3.select(tempChartRef.current).select("svg g");
    
    
    const titleText = getTitleText('temperature');
    
    svg.select(".chart-title")
      .text(titleText);
    
    
    svg.select(".y-axis")
      .transition()
      .duration(800)
      .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d / 1000) + "k"));
    
    
    svg.select(".grid")
      .transition()
      .duration(800)
      .call(d3.axisLeft(y)
            .tickSize(-adjustedWidth)
            .tickFormat("")
      );
    
    
    const bars = svg.selectAll(".bar")
      .data(chartData);
    
    
    bars.exit()
      .transition()
      .duration(500)
      .attr("y", height)
      .attr("height", 0)
      .remove();
    
    
    bars.transition()
      .duration(800)
      .attr("x", d => x(d.temperatureLabel))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.temperatureLabel))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", colors.bars)
      .attr("rx", 4)
      .transition()
      .duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    const labels = svg.selectAll(".bar-label")
      .data(chartData);
    
    
    labels.exit()
      .transition()
      .duration(500)
      .attr("y", height)
      .style("opacity", 0)
      .remove();
    
    
    labels.transition()
      .duration(800)
      .attr("x", d => x(d.temperatureLabel) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .text(d => d3.format(",.0f")(d.value / 1000) + "k");
    
    
    labels.enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.temperatureLabel) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-size", "10px")
      .style("opacity", 0)
      .text(d => d3.format(",.0f")(d.value / 1000) + "k")
      .transition()
      .duration(800)
      .attr("y", d => y(d.value) - 5)
      .style("opacity", 1);
  }
  
  return () => {
    
    if (!tempChartRef.current) {
      d3.select("body").selectAll(".d3-tooltip").remove();
    }
  };

}, [tempBinData, dayType, holidayType, view]); 


useEffect(() => {
  if (precipBinData.length === 0 || !precipChartRef.current || view !== 'precipitation') return;
  
  
  const margin = { top: 40, right: 30, bottom: 80, left: 80 };
  const width = precipChartRef.current.clientWidth || 800;
  const adjustedWidth = width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  
  const chartData = precipBinData.map(d => {
    let value;
    if (dayType === 'weekday') {
      value = d.weekdayRidership;
    } else if (dayType === 'weekend') {
      value = d.weekendRidership;
    } else if (holidayType === 'holiday') {
      value = d.holidayRidership;
    } else if (holidayType === 'non-holiday') {
      value = d.nonHolidayRidership;
    } else {
      value = d.averageRidership;
    }
    return {
      ...d,
      value
    };
  });
  
  
  const x = d3.scaleBand()
    .domain(chartData.map(d => d.precipitationBin))
    .range([0, adjustedWidth])
    .padding(0.3);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.value) * 1.1])
    .range([height, 0]);
  
  
  let svg = d3.select(precipChartRef.current).select("svg");
  let isInitialRender = svg.empty();
  
  if (isInitialRender) {
    
    svg = d3.select(precipChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("fill", colors.text);
    
    
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
            .tickFormat(d => d3.format(",.0f")(d / 1000) + "k"))
      .style("fill", colors.text);
    
    
    svg.append("text")
      .attr("class", "x-title")
      .attr("transform", `translate(${adjustedWidth/2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("fill", colors.text)
      .text("Precipitation Level");
    
    
    svg.append("text")
      .attr("class", "y-title")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", colors.text)
      .text("Average Ridership");
    
    
    const titleText = getTitleText('precipitation');
    
    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", adjustedWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("fill", colors.accent)
      .text(titleText);
    
    
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
            .tickSize(-adjustedWidth)
            .tickFormat("")
      )
      .style("stroke", colors.grid)
      .style("opacity", 0.3);
    
    
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", colors.tooltip)
      .style("border", "1px solid #555")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
      .style("pointer-events", "none")
      .style("z-index", "10");
    
    
    svg.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.precipitationBin))
      .attr("width", x.bandwidth())
      .attr("y", height) 
      .attr("height", 0) 
      .attr("fill", "#007FFF")
      .attr("rx", 4)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d3.color("#007FFF").brighter(0.5));
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`
          <strong>Precipitation: ${d.precipitationBin}</strong><br/>
          Average Ridership: ${d3.format(",.0f")(d.value)}<br/>
          Sample size: ${d.count} days
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#007FFF");
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition() 
      .duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    svg.selectAll(".bar-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.precipitationBin) + x.bandwidth() / 2)
      .attr("y", height) 
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-size", "10px")
      .style("opacity", 0) 
      .text(d => d3.format(",.0f")(d.value / 1000) + "k")
      .transition() 
      .duration(800)
      .style("opacity", 1)
      .attr("y", d => y(d.value) - 5);
  } else {
    
    svg = d3.select(precipChartRef.current).select("svg g");
    
    
    const titleText = getTitleText('precipitation');
    
    svg.select(".chart-title")
      .text(titleText);
    
    
    svg.select(".y-axis")
      .transition()
      .duration(800)
      .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d / 1000) + "k"));
    
    
    svg.select(".grid")
      .transition()
      .duration(800)
      .call(d3.axisLeft(y)
            .tickSize(-adjustedWidth)
            .tickFormat("")
      );
    
    
    const bars = svg.selectAll(".bar")
      .data(chartData);
    
    
    bars.exit()
      .transition()
      .duration(500)
      .attr("y", height)
      .attr("height", 0)
      .remove();
    
    
    bars.transition()
      .duration(800)
      .attr("x", d => x(d.precipitationBin))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.precipitationBin))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "#007FFF")
      .attr("rx", 4)
      .transition()
      .duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));
    
    
    const labels = svg.selectAll(".bar-label")
      .data(chartData);
    
    
    labels.exit()
      .transition()
      .duration(500)
      .attr("y", height)
      .style("opacity", 0)
      .remove();
    
    
    labels.transition()
      .duration(800)
      .attr("x", d => x(d.precipitationBin) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .text(d => d3.format(",.0f")(d.value / 1000) + "k");
    
    
    labels.enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.precipitationBin) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-size", "10px")
      .style("opacity", 0)
      .text(d => d3.format(",.0f")(d.value / 1000) + "k")
      .transition()
      .duration(800)
      .attr("y", d => y(d.value) - 5)
      .style("opacity", 1);
  }
  
  return () => {
    
    if (!precipChartRef.current) {
      d3.select("body").selectAll(".d3-tooltip").remove();
    }
  };
}, [precipBinData, dayType, holidayType, view]); 

  
  useEffect(() => {
    if (data.length === 0 || !scatterChartRef.current || view !== 'scatter') return;
    
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = scatterChartRef.current.clientWidth || 800;
    const adjustedWidth = width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    
    let filteredData = data;

    
    if (dayType === 'weekday') {
      filteredData = filteredData.filter(d => !d.weekend);
    } else if (dayType === 'weekend') {
      filteredData = filteredData.filter(d => d.weekend);
    }
    
    
    if (holidayType === 'holiday') {
      filteredData = filteredData.filter(d => d.holiday);
    } else if (holidayType === 'non-holiday') {
      filteredData = filteredData.filter(d => !d.holiday);
    }
    
    
    const x = d3.scaleLinear()
      .domain([
        d3.min(filteredData, d => d.temperature) - 5, 
        d3.max(filteredData, d => d.temperature) + 5
      ])
      .range([0, adjustedWidth]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.ridership) * 1.1])
      .range([height, 0]);
    
    
    let svg = d3.select(scatterChartRef.current).select("svg");
    let isInitialRender = svg.empty();
    
    if (isInitialRender) {
      
      svg = d3.select(scatterChartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => `${d}°F`))
        .style("color", colors.text);
      
      
      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d / 1000) + "k"))
        .style("color", colors.text);
      
      
      svg.append("text")
        .attr("class", "x-title")
        .attr("transform", `translate(${adjustedWidth/2}, ${height + margin.bottom - 20})`)
        .style("text-anchor", "middle")
        .style("fill", colors.text)
        .text("Temperature (°F)");
      
      
      svg.append("text")
        .attr("class", "y-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", colors.text)
        .text("Daily Ridership");
      
      
      const titleText = getTitleText('scatter');
      
      svg.append("text")
        .attr("class", "chart-title")
        .attr("x", adjustedWidth / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", colors.accent)
        .text(titleText);
      
      
      svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
              .tickSize(-adjustedWidth)
              .tickFormat("")
        )
        .style("stroke", colors.grid)
        .style("opacity", 0.3);
      
      
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", colors.tooltip)
        .style("border", "1px solid #555")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
        .style("pointer-events", "none")
        .style("z-index", "10");
      
      
      svg.append('g')
        .attr("class", "points-group")
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => x(d.temperature))
        .attr("cy", height) 
        .attr("r", 0) 
        .style("fill", d => {
          if (d.holiday) return colors.holiday;
          return d.weekend ? colors.weekend : colors.weekday;
        })
        .style("opacity", 0) 
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("r", 8)
            .style("opacity", 1);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          
          let holidayInfo = d.holiday ? `<br/>Holiday: ${d.holidayName}` : '';
          
          tooltip.html(`
            <strong>Date: ${d.date}</strong><br/>
            Temperature: ${d.temperature.toFixed(1)}°F<br/>
            Ridership: ${d3.format(",.0f")(d.ridership)}<br/>
            ${d.weekend ? 'Weekend' : 'Weekday'}${holidayInfo}
          `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("r", 5)
            .style("opacity", 0.7);
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
        
        .transition()
        .duration(400)
        .delay((d, i) => i * 1.5) 
        .attr("cy", d => y(d.ridership))
        .attr("r", 5)
        .style("opacity", 0.7);
      
      
      if (filteredData.length > 2) {
        const xSeries = filteredData.map(d => d.temperature);
        const ySeries = filteredData.map(d => d.ridership);
        
        const leastSquaresCoefficients = leastSquares(xSeries, ySeries);
        const x1 = d3.min(xSeries);
        const y1 = leastSquaresCoefficients[0] * x1 + leastSquaresCoefficients[1];
        const x2 = d3.max(xSeries);
        const y2 = leastSquaresCoefficients[0] * x2 + leastSquaresCoefficients[1];
        
        svg.append("line")
          .attr("class", "trendline")
          .attr("x1", x(x1))
          .attr("y1", y(y1))
          .attr("x2", x(x2))
          .attr("y2", y(y2))
          .attr("stroke", "#FF5722")
          .attr("stroke-width", 2)
          .style("stroke-dasharray", "5,5")
          .style("opacity", 0) 
          .transition()
          .duration(800)
          .delay(filteredData.length * 5) 
          .style("opacity", 1);
      }
      
      
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${adjustedWidth - 120}, 10)`);
      
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", colors.weekday);
      
      legend.append("text")
        .attr("x", 10)
        .attr("y", 5)
        .text("Weekday")
        .style("font-size", "12px")
        .style("fill", colors.text);
      
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 20)
        .attr("r", 5)
        .style("fill", colors.weekend);
      
      legend.append("text")
        .attr("x", 10)
        .attr("y", 25)
        .text("Weekend")
        .style("font-size", "12px")
        .style("fill", colors.text);
        
      
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 40)
        .attr("r", 5)
        .style("fill", colors.holiday);
      
      legend.append("text")
        .attr("x", 10)
        .attr("y", 45)
        .text("Holiday")
        .style("font-size", "12px")
        .style("fill", colors.text);

    } else {
      
      svg = d3.select(scatterChartRef.current).select("svg g");
      
      
      const titleText = getTitleText('scatter');
      
      svg.select(".chart-title")
        .text(titleText);
      
      
      svg.select(".x-axis")
        .transition()
        .duration(800)
        .call(d3.axisBottom(x).tickFormat(d => `${d}°F`));
      
      svg.select(".y-axis")
        .transition()
        .duration(800)
        .call(d3.axisLeft(y).tickFormat(d => d3.format(",.0f")(d / 1000) + "k"));
      
      
      svg.select(".grid")
        .transition()
        .duration(800)
        .call(d3.axisLeft(y)
              .tickSize(-adjustedWidth)
              .tickFormat("")
        );
      
      
      
      const pointsGroup = svg.select(".points-group");
      const points = pointsGroup.selectAll(".point").data(filteredData, d => d.date);
      
      
      points.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .style("opacity", 0)
        .remove();
      
      
      points.transition()
        .duration(800)
        .attr("cx", d => x(d.temperature))
        .attr("cy", d => y(d.ridership))
        .style("fill", d => {
          if (d.holiday) return colors.holiday;
          return d.weekend ? colors.weekend : colors.weekday;
        });
      
      
      points.enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => x(d.temperature))
        .attr("cy", height) 
        .attr("r", 0)
        .style("fill", d => {
          if (d.holiday) return colors.holiday;
          return d.weekend ? colors.weekend : colors.weekday;
        })
        .style("opacity", 0)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("r", 8)
            .style("opacity", 1);
          const tooltip = d3.select("body").select(".d3-tooltip");
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
            
          let holidayInfo = d.holiday ? `<br/>Holiday: ${d.holidayName}` : '';
          
          tooltip.html(`
            <strong>Date: ${d.date}</strong><br/>
            Temperature: ${d.temperature.toFixed(1)}°F<br/>
            Ridership: ${d3.format(",.0f")(d.ridership)}<br/>
            ${d.weekend ? 'Weekend' : 'Weekday'}${holidayInfo}
          `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("r", 5)
            .style("opacity", 0.7);
          d3.select("body").select(".d3-tooltip")
            .transition()
            .duration(500)
            .style("opacity", 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 5)
        .attr("cy", d => y(d.ridership))
        .attr("r", 5)
        .style("opacity", 0.7);
      
      
      svg.select(".trendline").remove(); 
      
      if (filteredData.length > 2) {
        const xSeries = filteredData.map(d => d.temperature);
        const ySeries = filteredData.map(d => d.ridership);
        
        const leastSquaresCoefficients = leastSquares(xSeries, ySeries);
        const x1 = d3.min(xSeries);
        const y1 = leastSquaresCoefficients[0] * x1 + leastSquaresCoefficients[1];
        const x2 = d3.max(xSeries);
        const y2 = leastSquaresCoefficients[0] * x2 + leastSquaresCoefficients[1];
        
        svg.append("line")
          .attr("class", "trendline")
          .attr("x1", x(x1))
          .attr("y1", y(y1))
          .attr("x2", x(x2))
          .attr("y2", y(y2))
          .attr("stroke", "#FF5722")
          .attr("stroke-width", 2)
          .style("stroke-dasharray", "5,5")
          .style("opacity", 0)
          .transition()
          .duration(800)
          .delay(500) 
          .style("opacity", 1);
      }
    }
    
    return () => {
      
      if (!scatterChartRef.current) {
        d3.select("body").selectAll(".d3-tooltip").remove();
      }
    };
  }, [data, dayType, holidayType, view]); 
  
  const getTitleText = (chartType) => {
    let baseTitle = '';
    let dayTypeText = '';
    let holidayTypeText = '';
    
    
    if (chartType === 'temperature') {
      baseTitle = 'Temperature Impact on NYC Subway Ridership';
    } else if (chartType === 'precipitation') {
      baseTitle = 'Precipitation Impact on NYC Subway Ridership';
    } else if (chartType === 'scatter') {
      baseTitle = 'Temperature vs. Ridership';
    }
    
    
    if (dayType === 'weekday') {
      dayTypeText = 'Weekdays';
    } else if (dayType === 'weekend') {
      dayTypeText = 'Weekends';
    } else {
      dayTypeText = 'All Days';
    }
    
    
    if (holidayType === 'holiday') {
      holidayTypeText = 'Holidays Only';
    } else if (holidayType === 'non-holiday') {
      holidayTypeText = 'Non-Holidays';
    } else {
      holidayTypeText = '';
    }
    
    
    if (holidayTypeText) {
      return `${baseTitle} (${dayTypeText}, ${holidayTypeText})`;
    } else {
      return `${baseTitle} (${dayTypeText})`;
    }
  };
  
  const leastSquares = (xSeries, ySeries) => {
    const reduceSumFunc = (prev, cur) => prev + cur;
    
    const xBar = xSeries.reduce(reduceSumFunc) / xSeries.length;
    const yBar = ySeries.reduce(reduceSumFunc) / ySeries.length;
    
    const ssXX = xSeries.map(d => Math.pow(d - xBar, 2))
      .reduce(reduceSumFunc);
    
    const ssYY = ySeries.map(d => Math.pow(d - yBar, 2))
      .reduce(reduceSumFunc);
    
    const ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar))
      .reduce(reduceSumFunc);
    
    const slope = ssXY / ssXX;
    const intercept = yBar - (xBar * slope);
    
    return [slope, intercept];
  };

  return (
    <div className="fullscreen-tab-container">
      <h1>D3 Insights</h1>
      
      <div className="controls">
        <div className="control-group">
          <div className="control-label">Charts</div>
          <div className="view-selector">
            <button
              className={view === 'temperature' ? 'active' : ''}
              onClick={() => setView('temperature')}
            >
              Temperature Analysis
            </button>
            <button
              className={view === 'precipitation' ? 'active' : ''}
              onClick={() => setView('precipitation')}
            >
              Precipitation Analysis
            </button>
            <button
              className={view === 'scatter' ? 'active' : ''}
              onClick={() => setView('scatter')}
            >
              Scatter Plot
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <div className="control-label">Day Filters</div>
          <div className="day-selector">
            <button
              className={dayType === 'all' ? 'active' : ''}
              onClick={() => setDayType('all')}
            >
              All Days
            </button>
            <button
              className={dayType === 'weekday' ? 'active' : ''}
              onClick={() => setDayType('weekday')}
            >
              Weekdays
            </button>
            <button
              className={dayType === 'weekend' ? 'active' : ''}
              onClick={() => setDayType('weekend')}
            >
              Weekends
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <div className="control-label">Holiday Filters</div>
          <div className="holiday-selector">
            <button
              className={holidayType === 'all' ? 'active' : ''}
              onClick={() => setHolidayType('all')}
            >
              All Days
            </button>
            <button
              className={holidayType === 'non-holiday' ? 'active' : ''}
              onClick={() => setHolidayType('non-holiday')}
            >
              No Holidays
            </button>
            <button
              className={holidayType === 'holiday' ? 'active' : ''}
              onClick={() => setHolidayType('holiday')}
            >
              Only Holidays
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="chart-area">
          {view === 'temperature' && (
            <div className="chart-container">
              <div ref={tempChartRef} className="chart"></div>
              <div className="chart-description">
                <h3>How Temperature Affects Ridership</h3>
                <p>
                  This chart shows the relationship between temperature ranges and average daily ridership. 
                </p>
                <p>
                  Weekday ridership is consistently higher than weekend ridership across all temperature ranges.
                </p>
                {holidayType === 'holiday' && (
                  <p>
                    Holiday ridership tends to follow patterns similar to weekends, regardless of temperature.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {view === 'precipitation' && (
            <div className="chart-container">
              <div ref={precipChartRef} className="chart"></div>
              <div className="chart-description">
                <h3>How Precipitation Affects Ridership</h3>
                <p>
                  This chart illustrates the impact of different precipitation conditions on subway ridership.
                </p>
                <p>
                  Heavy rain appears to have the most significant impact.
                </p>
                {holidayType === 'holiday' && (
                  <p>
                    Holidays show more sensitivity to precipitation compared to regular days.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {view === 'scatter' && (
            <div className="chart-container">
              <div ref={scatterChartRef} className="chart"></div>
              <div className="chart-description">
                <h3>Temperature vs. Ridership Relationship</h3>
                <p>
                  This scatter plot shows individual data points representing daily temperature and ridership values.
                </p>
                <p>
                  The visualization reveals both the overall trend and the day-to-day variation in ridership.
                </p>
                {holidayType === 'holiday' && (
                  <p>
                    Holidays (shown in magenta) tend to have lower ridership regardless of temperature.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="key-insights">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🌡️</div>
            <h3>Temperature Effect</h3>
            <p>
              Moderate temperatures (50-70°F) generally see the highest ridership, 
              with extreme hot or cold temperatures showing decreased subway usage.
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🌧️</div>
            <h3>Rain Impact</h3>
            <p>
              Heavy precipitation significantly reduces ridership, with a more
              pronounced effect on weekends and holidays compared to regular weekdays.
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <h3>Day Type</h3>
            <p>
              Weekday ridership is consistently higher than weekend ridership.
              Holidays show unique patterns, often resembling weekends even when they fall on weekdays.
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <h3>Hoilday</h3>
            <p>
              Holiday ridership is consistently lower than non-holiday ridership.
              Most notably, holiday ridership seems to be most impacted by precipitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3;