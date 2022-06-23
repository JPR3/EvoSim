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
function updateGraphs(averages){
    //Make this better
    ferocityData.push(averages[0]);
    ferocityChart.data.labels.push("")
    ferocityChart.options.plugins.title.text = "Ferocity: " + averages[0];
    healthData.push(averages[1]);
    healthChart.data.labels.push("");
    healthChart.options.plugins.title.text = "Health: " + averages[1];
    speedData.push(averages[2]);
    speedChart.data.labels.push("");
    speedChart.options.plugins.title.text = "Speed: " + averages[2];
    ferocityChart.update();
    healthChart.update();
    speedChart.update();
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
