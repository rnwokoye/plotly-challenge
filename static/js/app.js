//define dropdown menu
function dropdown(){
    var ID = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        var id = data.names;
        id.forEach((sampleid)=>{
            ID.append("option")
            .text(sampleid)
            .property("value",sampleid)
        })
        var sample1 = id[0];
        buildMetadata(sample1);
        buildCharts(sample1);
    })
}

dropdown()

function optionChanged(newsample){
    buildMetadata(newsample);
    buildCharts(newsample);
    gauge_plot(newsample);
    }
   
    
function buildMetadata(sample) {
// metadata 
    d3.json("samples.json").then(function(data){
        var metadata = data.metadata;
        var filterdata = metadata.filter(sampleobject => sampleobject.id==sample);
        var result = filterdata[0];
        var sampleData = d3.select("#sample-metadata");
        sampleData.html("");
        Object.entries(result).forEach(function([key,value]){
            var row = sampleData.append("p");
            row.text(`${key}:${value}`)
            wfreq = result.wfreq   
        })
    });
}


function buildCharts(sample) {
    // Use d3.json to get data
    d3.json("samples.json").then(function(data) {
        var metadata = data.samples;
        var filterdata = metadata.filter(sampleobject => sampleobject.id==sample);
        var result = filterdata[0];
        var OTU_ids = result.otu_ids;
        var OTU_labels = result.otu_labels;
        var samplevalue = result.sample_values;


        // Barchart / horizontal 
        var barchart = [{
            y: OTU_ids.slice(0,10).map(otu_ids=>`OTU ${otu_ids}`).reverse(),
            x: samplevalue.slice(0,10).reverse(),
            text: OTU_labels.slice(0,10).reverse(),
            type: "bar",
            orientation:"h"
          }];

        var barlayout = {
        title : "Top 10 Bacteria Cultures Found"
        }

        Plotly.newPlot('bar',barchart,barlayout);

        //Bubble Chart
        var bubbledata = [{
            x: OTU_ids, 
            y: samplevalue,
            text: OTU_labels,
            mode:"markers",
            marker: {
                size: samplevalue,
                color: OTU_ids,
                colorscale: "Earth"
            }

        }]


        var bubblelayout = {
            title : "Bacteria Culture Per Sample",
            xaxis: {
                title:"OTU ID"},
        }

        Plotly.newPlot('bubble',bubbledata,bubblelayout)

        // guage_plot
        var guage_plot = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
		    mode: "gauge+number",
            gauge: {
            axis: { range: [null, 9] },        
        }
    }];

        var guagelayout = {
            title: "Belly Button Washing Frequency",
        }

        Plotly.newPlot('gauge', guage_plot, guagelayout);

    });

};


    
        
    
     
            
            
    
            
    