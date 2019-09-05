function buildMetadata(sample) {

  var url = `/metadata/${sample}`
  var selector = d3.select("#sample-metadata");

  d3.json(url).then(function(response) {

    console.log(response);
    selector.html("").html(`<strong>AGE:</strong> ${response.AGE}<br> <strong>BBTYPE:</strong> ${response.BBTYPE}<br><strong>ETHNICITY:</strong> ${response.ETHNICITY}<br> <strong>GENDER:</strong> ${response.GENDER}<br> <strong>LOCATION:</strong> ${response.LOCATION}<br> <strong>WFREQ:</strong> ${response.WFREQ}<br> <strong>SAMPLE:</strong> ${response.sample}`);
  });

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}


function buildCharts(sample) {

  var url = `/samples/${sample}`

  d3.json(url).then(function(response) {

    console.log(response);
    var trace1 = {
      labels: response.otu_ids.slice(0,10),
      values: response.sample_values.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      // name: 'OTU Lable',
      // hoverinfo: 'name+hovertext',
      type: 'pie'
    };

    var data1 = [trace1];
    // var layout1 = {
    //   title: "Pet Pals",
    //   xaxis: {title: "blah"},
    //   yaxis: {title: "blah"}
    // };

    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      //marker size/color/text values for label
      mode: 'markers',
      text: response.otu_labels,
      marker: {
        size: response.sample_values,
        sizeref: 2,
        color: response.otu_ids
      }
    };
    var data2 = [trace2];
    var layout2 = {
      xaxis: {title: "OTU ID"},
    };

    Plotly.newPlot("pie", data1);
    Plotly.newPlot("bubble", data2, layout2);
  });


  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
