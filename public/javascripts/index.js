var variables,nums,activeVars,xis;
var colors = ["red","olive","yellow","green","blue","aqua","purple"];


function variableNumProcess(){
    var number = parseInt(document.getElementsByClassName("numbOfVariables")[0].value);
    var deltaT = document.getElementsByClassName("deltaT")[0];
    if (deltaT.value == "" || number.value == "" ) {
        alertify.notify("Please Complete all the Fields",10);
        return;
    }
    var B = document.getElementsByClassName("B-vector");
    var Matrix = document.getElementsByClassName("A-MATRIX");
    var X0 = document.getElementsByClassName("Initial-vector");
    var primary = document.getElementsByClassName("initial-inputs")[0];
    var button = document.getElementById("butt");
    button.disabled = true;
    button.style.visibility = "hidden";
    Matrix[0].innerHTML = prepareMatrix(number);
    X0[0].innerHTML = prepareX0(number);
    B[0].innerHTML = prepareB(number);
    Matrix[0].style.color = "rgb(189, 55, 55)";
    X0[0].style.color = "rgb(189, 55, 55)";
    B[0].style.color = "rgb(189, 55, 55)";
    Matrix[0].style.border = "2px dashed lightblue";
    X0[0].style.border = "2px dashed lightblue";
    B[0].style.border = "2px dashed lightblue";
    Matrix[0].style.borderRadius = "30px";
    X0[0].style.borderRadius = "30px";
    B[0].style.borderRadius = "30px";
    setMargin(number);
    primary.style.height = "70%" ;
    primary.style.borderRadius = "40px";
    document.getElementById("run").innerHTML = "<button onclick = \"run();\" style = \" margin-left:37%; width:200px; height: 60px;\">RUN</button>";
}


function calxis() {
    var howMany = document.getElementById("q").value, newSeries ;
    xis = [variables[0].X0];
    for ( var i = 1 ; i <= howMany ; i++ ) {
        newSeries = [];
        for ( var j = 0 ; j < variables.length ; j++ ) {
            newSeries.push(MatrixProduct( variables[j].AT, xis[xis.length-1]) + variables[j].B + xis[xis.length-1][j] );
        }
        xis.push(newSeries);
    }
}

function setActiveVars() {
    activeVars = [];
    var r = document.getElementsByClassName("vars");
    for ( var i = 0 ; i < r.length ; i++ ) {
        if ( r[i].checked == true ) activeVars.push(variables[i]);
    }
}

function MatrixProduct(A,Xi) {
    var res = 0;
    for ( var i = 0 ; i < A.length ; i++ ) {
        res += A[i] * Xi[i] ;
    }
    return res;
}

function prepareData(n){
    var data = [];
    for ( var i = 0 ; i < xis.length ; i++ ) {
        data.push(xis[i][activeVars[n].no-1]);
    }
    return data;
}

function prepareSeries() {
    var series = [];
    var data;
    for ( var i = 0 ; i < activeVars.length; i++ ) {
        data = prepareData(i);
        series.push({
            name:activeVars[i].no,
            data:data,
            color:colors[i%7]
        });
    }
    return series;
}

function prepareCats() {
    var howMany = document.getElementById("q").value, cats = [];
    for ( var i = 0 ; i < howMany ; i++ ) {
        cats.push(i);
    }
}

function drawStatePath(){
    setActiveVars();
    if (activeVars.length < 2 || activeVars.length > 3) {
        document.getElementById('container').innerHTML = "";
        return;
    }
    else if (activeVars.length == 2) drawState2D();
    else if (activeVars.length == 3) drawState3D(); 
}



function drawState2D() {
    // document.getElementById("q").value = 10000;
    document.getElementById("container").innerHTML = "";
    calxis();
    var trace = {
        x:prepareData(0),
        y:prepareData(1),
        type:"scatter",
    };
    var data = [trace];
    Plotly.newPlot("container",data);
}

function drawState3D() {
    document.getElementById("container").innerHTML = "";
    calxis();
    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
        var trace1 = {
        x:prepareData(0), y: prepareData(1), z: prepareData(2),
        mode: 'lines',
        marker: {
            size: 12,
            line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5
            },
            opacity: 0.8
        },
        type: 'scatter3d'
    };
    var data = [trace1];
    var layout = {
        margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
          }
    };
    Plotly.newPlot('container', data, layout);
});
}

function drawInterface(){
    console.log(document.getElementsByClassName("btn-t")[0].style.fontSize);
    if (document.getElementsByClassName("btn-t")[0].style.fontSize == "21px") draw();
    else drawStatePath();
}


function btnTSelected() {
    document.getElementsByClassName("btn-t")[0].style.backgroundColor = "rgb(8, 240, 228)";
    document.getElementsByClassName("btn-t")[0].style.fontSize = "21px";
    document.getElementsByClassName("btn-s")[0].style.backgroundColor = "rgb(7, 145, 209)";
    document.getElementsByClassName("btn-s")[0].style.fontSize = "20px";
    drawInterface();
    // draw();

}

function btnSSelected() {
    document.getElementsByClassName("btn-t")[0].style.backgroundColor = "rgb(7, 145, 209)";
    document.getElementsByClassName("btn-t")[0].style.fontSize = "20px";
    document.getElementsByClassName("btn-s")[0].style.backgroundColor = "rgb(8, 240, 228)";
    document.getElementsByClassName("btn-s")[0].style.fontSize = "21px" ;
    drawInterface();
}

function draw () {
    // document.getElementById("howMany").style.visibility = "visible";
    document.getElementById("container").innerHTML = "";
    calxis();
    if(document.getElementById("q").value == "" ) return;
    setActiveVars();
    var series1 = prepareSeries();
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'متغیر های حالت'
        },
        xAxis: {
            allowDecimals:false,
        },
        yAxis: {
            title: {
                text: 'value'
            },
            style: {
                fontSize:"40px",
            }
            
        },
        series: series1
    });
}

function prepareVarList () {
    var inner = "" ;
    for ( var i = 0 ; i < nums ; i++ ) {
        inner += "<li>" + (i+1).toString() + ":  <input class = \"vars\" type = \"checkbox\" onclick = \" drawInterface();\" > </li> "; 
    }
    return inner;
}

function signout(){
    window.location.replace("/signout");
}

function choose() {
    $.ajax({
        async:false,
        url:"/get",
        method:"POST",

    }).done(function(res){
        variables = res.vars;
        nums = res.num;
    }).fail(function(err){
        console.log(err);
    })
    var c = document.getElementById("choose");
    c.innerHTML = prepareVarList();
}

function prepareValues(V) {
    var values = [];
    for ( var i = 0 ; i < V.length ; i++ ) {
        values.push(parseFloat(V[i].value));
    }
    return values;
}

function run() {
    var nums = parseInt(document.getElementsByClassName("numbOfVariables")[0].value);
    var T = document.getElementsByClassName("deltaT")[0].value;
    var A = document.getElementsByClassName("Matrix");
    A = prepareValues(A);
    var XZ = document.getElementsByClassName("X0");
    XZ = prepareValues(XZ);
    var B = document.getElementsByClassName("B");
    B = prepareValues(B);
    $.ajax({
        method:"POST",
        url:"/cal",
        data:{
            nums,
            T,
            A,
            XZ,
            B
        }
    }).done(function(res){
        window.location.replace("/draw");
    }).fail(
        function (err) {
            console.log("failed");
        }
    )
}


function setMargin(number){
    var inputsList = document.getElementsByClassName("Matrix");
    var temp = 47 - number  ;
    for ( var i = 0 ; i < inputsList.length ; i += number ) {
        inputsList[i].style.marginLeft = temp.toString() + "%";
    }
}

function prepareMatrix(number) {
    var inner = "<br>";
    inner += "درایه های ماتریس را مشخص کنید";
    inner += "<br> <br>";
    var inptemplate = "<input type = \"text\" class = \"Matrix\" style = \"width:30px; background-color:rgb(150, 148, 148)\" >";
    for (var i = 0 ; i < number ; i++ ) {
        inner += "<div style = \"display:flex; padding:5px; \" >";
        for ( var j = 0 ; j < number ; j++ ) {
            inner += inptemplate;
        }
        inner += "</div>";
    }
    inner += "<br><br><br>"
    return inner;
}


function prepareX0(number) {
    var inner = "<br>";
    inner += "ماتریس اولیه را مشخص کنید" ;
    inner += "<br><br>";
    var inptemplate = "<input type = \"text\" class = \"X0\" style = \"width:30px; margin:5px;background-color:rgb(150, 148, 148)\" > <br> ";
    for ( var i = 0 ; i < number ; i ++ ) {
        inner += inptemplate;
    }
    inner += "<br><br>";
    return inner;
}

function prepareB(number) {
    var inner = "<br>";
    inner += "ماتریس ورودی را مشخص کنید" ;
    inner += " <br> <br>";
    var inptemplate = "<input type = \"text\" class = \"B\" style = \"width:30px; margin:5px;background-color:rgb(150, 148, 148)\" > <br> ";
    for ( var i = 0 ; i < number ; i ++ ) {
        inner += inptemplate;
    }
    inner += "<br><br>"
    return inner;
}
