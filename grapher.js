const fGraph = document.getElementById("fGraph");
const hGraph = document.getElementById("hGraph");
const sGraph = document.getElementById("sGraph");
const pieGraph = document.getElementById("pieGraph");
const graphs = [fGraph, hGraph, sGraph, pieGraph];
const fGraphChart = document.getElementById("fGraph").getContext("2d");
const hGraphChart = document.getElementById("hGraph").getContext("2d");
const sGraphChart = document.getElementById("sGraph").getContext("2d");
const pieGraphChart = document.getElementById("pieGraph").getContext("2d");
let ferocityData = [];
let healthData = [];
let speedData = [];
let pieData = [1, 1, 1];
function updateGraphs(averages){
    ferocityData.push(averages.fAvg);
    ferocityChart.data.labels.push("")
    ferocityChart.options.plugins.title.text = "Ferocity: " + roundToTwo(averages.fAvg);

    healthData.push(averages.hAvg);
    healthChart.data.labels.push("");
    healthChart.options.plugins.title.text = "Health: " + roundToTwo(averages.hAvg);

    speedData.push(averages.sAvg);
    speedChart.data.labels.push("");
    speedChart.options.plugins.title.text = "Speed: " + roundToTwo(averages.sAvg);

    //Convert averages into relative values
    let [f, h, s] = Object.values(averages)
    f = roundToTwo(f * 6);
    h = roundToTwo(h * 7.5);
    s = roundToTwo(s * 100);
    pieChart.data.datasets[0].data = [f, h, s];
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
            data:ferocityData,
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
            data:healthData,
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
            data:speedData,
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
                display: true
            },
            title:{
                display: false,
                text: ""
            }
        },
        responsive: true,
        maintainAspectRatio: false
        
    }
})
