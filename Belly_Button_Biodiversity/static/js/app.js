function buildMetadata(sample) {

  var url = `/metadata/${sample}`
  var selector = d3.select("#sample-metadata");

  d3.json(url).then(function(response) {

    console.log(response);
    selector.html("").html(`<strong>AGE:</strong> ${response.AGE}<br> <strong>BBTYPE:</strong> ${response.BBTYPE}<br><strong>ETHNICITY:</strong> ${response.ETHNICITY}<br> <strong>GENDER:</strong> ${response.GENDER}<br> <strong>LOCATION:</strong> ${response.LOCATION}<br> <strong>WFREQ:</strong> ${response.WFREQ}<br> <strong>SAMPLE:</strong> ${response.sample}`);
    buildGauge(response.WFREQ);
  });

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
}

function gaugePointer(value){

  value = value * 10 + 30;
	var degrees = 180 - value,
	 radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
  	 pathX = String(x),
  	 space = ' ',
  	 pathY = String(y),
  	 pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

	return path;

}

function buildGauge(WFREQ) {
  var data = [
    {
    type: 'category',
    x: [0],
    y:[0],
    marker: {
      size: 28,
      color:'850000'},
    showlegend: false,
  },

  {
    values: [90/9,90/9,90/9,90/9,90/9,90/9,90/9,90/9,90/9, 90],
    rotation: 90,

    text: ['8-9', '7-8', '6-7', '5-6',
    '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 30, .9)','rgba(14, 127, 22, .8)','rgba(14, 127, 22, .6)','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    'rgba(210, 206, 145, .6)', 'rgba(210, 206, 145, .3)',
    'rgba(255, 255, 255, 0)']},
    // labels: ['4.5-5', '3.5-4.49', '2.5-3.49', '1.5-2.49', '1-1.49'],
    // hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false,
  }];

  var layout = {
    shapes:[{
      type: 'path',
      path: gaugePointer(WFREQ),
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],

    title: 'Belly Button Washing Frequency <br> (Washes per Week)',
    height: 600,
    width: 800,
    xaxis: {type:'category',
      zeroline:false,
      showticklabels:false,
      showgrid: false,
      range: [-1, 1]},
    yaxis: {type:'category',
      zeroline:false,
      showticklabels:false,
      showgrid: false,
      range: [0, 1]},
  };

  Plotly.newPlot('gauge', data, layout);
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
