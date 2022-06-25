const fGraph = document.getElementById("fGraph");
const hGraph = document.getElementById("hGraph");
const sGraph = document.getElementById("sGraph");
const pieGraph = document.getElementById("pieGraph");
const graphs = [fGraph, hGraph, sGraph, pieGraph];
const fGraphChart = document.getElementById("fGraph").getContext("2d");
const hGraphChart = document.getElementById("hGraph").getContext("2d");
const sGraphChart = document.getElementById("sGraph").getContext("2d");

const pieGraphChart = document.getElementById("pieGraph").getContext("2d");
let dataLength = 0;
let pieData = [1, 1, 1];
function updateGraphs(averages){
    dataLength++;
    ferocityChart.data.datasets[0].data.push(averages.fAvg);
    ferocityChart.data.labels.push("")
    ferocityChart.options.plugins.title.text = "Ferocity: " + roundToTwo(averages.fAvg);

    healthChart.data.datasets[0].data.push(averages.hAvg);
    healthChart.data.labels.push("");
    healthChart.options.plugins.title.text = "Health: " + roundToTwo(averages.hAvg);

    speedChart.data.datasets[0].data.push(averages.sAvg);
    speedChart.data.labels.push("");
    speedChart.options.plugins.title.text = "Speed: " + roundToTwo(averages.sAvg);

    //Convert averages into relative values
    let [f, h, s] = Object.values(averages)
    f = roundToTwo(f * 6);
    h = roundToTwo(h * 7.5);
    s = roundToTwo(s * 100);
    pieChart.data.datasets[0].data = [f, h, s];
    //Condense graph data if necessary
    if(dataLength >= 50){
        dataLength = Math.round(dataLength / 2);
        for(let i = 0; i < 3; i++){
            lineCharts[i].data.datasets[0].data = condenseList(lineCharts[i].data.datasets[0].data);
            lineCharts[i].data.labels = Array(lineCharts[i].data.datasets[0].data.length).fill("");
        }
    }
    ferocityChart.update();
    healthChart.update();
    speedChart.update();
    pieChart.update();
}

let ferocityChart = new Chart(fGraphChart, {
    type:"line",
    data:{
        labels:[],
        label:"Ferocity",
        datasets:[{
            label:"Ferocity",
            data:[],
            fill: true,
            backgroundColor:"#872020"
        }]        
    },
    options:{
        plugins: {
            legend: {
                display: false
            },
            title:{
                display: true,
                text: ""
            }
        },
        responsive: true,
        maintainAspectRatio: false

    }
})
let healthChart = new Chart(hGraphChart, {
    type:"line",
    data:{
        labels:[],
        label:"Health",
        datasets:[{
            label:"Health",
            data:[],
            fill: true,
            backgroundColor:"#2a802b"
        }]        
    },
    options:{
        plugins: {
            legend: {
                display: false
            },
            title:{
                display: true,
                text: ""
            }
        },
        responsive: true,
        maintainAspectRatio: false
        
    }
})
let speedChart = new Chart(sGraphChart, {
    type:"line",
    data:{
        labels:[],
        label:"Speed",
        datasets:[{
            label:"Speed",
            data:[],
            fill: true,
            backgroundColor:"#14199c"
        }]        
    },
    options:{
        plugins: {
            legend: {
                display: false
            },
            title:{
                display: true,
                text: ""
            }
        },
        responsive: true,
        maintainAspectRatio: false
        
    }
})
const lineCharts = [ferocityChart, healthChart, speedChart];
let pieChart = new Chart(pieGraphChart, {
    type:"pie",
    data:{
        labels:[
            "Ferocity",
            "Health",
            "Speed"
        ],
        label:"Distribution",
        datasets:[{
            label:"Distribution",
            data:pieData,
            fill: true,
            backgroundColor:[
                "#872020",
                "#2a802b",
                "#14199c"
            ]
        }]        
    },
    options:{
        plugins: {
            legend: {
                display: false
            },
            title:{
                display: true,
                text: "Average Stat Distribution"
            },
            tooltip:{
                callbacks: {
                    label: function(context){
                      var label = context.label,
                          currentValue = context.raw,
                          total = context.chart._metasets[context.datasetIndex].total;
            
                      var percentage = parseFloat((currentValue/total*100).toFixed(1));
            
                      return label + ": " + percentage + '%';
                    }
                  }
            }
        },
        responsive: true,
        maintainAspectRatio: false
        
    }
})
function condenseList(list){
    newList = []
    for(let i = 0; i < list.length; i += 2){
        if(i + 1 >= list.length){
            newList.push(list[i])
        }
        else{
            newList.push((list[i] + list[i+1]) / 2)
        }
    }
    return newList;
}