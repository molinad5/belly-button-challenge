function initializeDashboard() {
  let dropdownMenu = d3.select("#selDataset");

  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let sampleIDs = data.names;

    for (let i = 0; i < sampleIDs.length; i++) {
      dropdownMenu
        .append("option")
        .text(sampleIDs[i])
        .property("value", sampleIDs[i]);
    }

    let initialSample = sampleIDs[0];
    createCharts(initialSample);
    populateMetadata(initialSample);
  });
}

function createCharts(selectedSample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let allSamples = data.samples;
    let filteredSample = allSamples.filter(sampleObj => sampleObj.id == selectedSample);
    let sampleData = filteredSample[0];

    let otuIDs = sampleData.otu_ids;
    let otuLabels = sampleData.otu_labels;
    let sampleValues = sampleData.sample_values;

    // Bar Chart
    let barYTicks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barChartData = [
      {
        y: barYTicks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barChartData, barChartLayout);

    // Bubble Chart
    let bubbleChartLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };

    let bubbleChartData = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
  });
}

function populateMetadata(selectedSample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadataArray = data.metadata;

    let filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == selectedSample);
    let sampleMetadata = filteredMetadata[0];

    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    for (let key in sampleMetadata) {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${sampleMetadata[key]}`);
    }
  });
}

function optionChanged(newSample) {
  createCharts(newSample);
  populateMetadata(newSample);
}

// Initialize the dashboard
initializeDashboard();

