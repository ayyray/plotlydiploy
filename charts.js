function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    
    // 3-5.Create a variable that holds: samples, filters, and first sample in array.
    let allSamples = data.samples;
    let filteredSample = allSamples.filter(sampleObj =>sampleObj.id ==sample);
    let selectedSample = filteredSample[0];
    console.log(selectedSample);
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDarray = selectedSample.otu_ids;
    console.log(otuIDarray)
    let otuLabelArray = selectedSample.otu_labels;
    console.log(otuLabelArray)
    let sampleValuesArray = selectedSample.sample_values;
    console.log(sampleValuesArray)
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let yticks = otuIDarray.slice(0,10).map(id=>`OTU ${id}`).reverse();
    
    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValuesArray.slice(0,10).reverse(),
      text: otuLabelArray.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValuesArray,
        colorscale: "stock",
        }
    }];
    
    // Create the layout for the bar chart. 
    let barLayout = {
      title: {
        text: "Top 10 Bacterial Cultures Found",
        font: {color: "black"}
      }
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: Bubble Chart Starter Code (Begin)
    
    
    // Create the trace for the bubble chart.   
    let bubbleData = [{
      x: otuIDarray,
      y: sampleValuesArray,
      text: otuIDarray.map(id=>`OTU ${id}`),
      mode: 'markers',
      marker: { 
        size: sampleValuesArray,
        color: otuIDarray,
        colorscale: "stock" }
    }];
    
    // Create the layout for the bubble chart.
    let bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per Sample",
        font: {color: "black"},
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredMeta);
    
    
    // 2. Create a variable that holds the first sample in the metadata arra
    let selectedMeta = filteredMeta[0]; 
    console.log(selectedMeta);
    
    // 3. Create a variable that holds the washing frequency.
    washFreq = selectedMeta.wfreq;
    console.log(washFreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      title: {
        text: "Belly Button Washing Frequency<br>Scrubs per Week<br>", 
        font: {color: "black", size: 16},
        padding: {top: 10, bottom: 100}
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0,1], color: "red"},
          {range: [1,2], color: "orange"},
          {range: [2,3], color: "yellow"},
          {range: [3,4], color: "green"},
          {range: [4,5], color: "blue"}, 
          {range: [5,6], color: "indigo"},
          {range: [6,7], color: "violet"},
          {range: [7,8], color: "lavender"},
          {range: [8,9], color: "brown"},
          {range: [9,10], color: "gray"},         
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 300,
      margin: {t:60, r:25, l:15, b:0}   
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}