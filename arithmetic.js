
<html>
    <head>
        <title>Arithmetic Challenge</title>
        <style>
            .large {
                font-size: 64px;
                font-family: Georgia;
            }
            .medium {
                font-size: 32px;
                font-family: Georgia;
            }
            .button {
                text-align: center;
                font-size: 32px;
            }
            .blue {
                background-color: #008CBA; /* Blue */
                color: white;
            }
            .green {
                background-color: #4CAF50; /* Green */
                color: white;
            }
        </style>
        <script>
            var ops = [
                "&plus;",
                "&minus;",
                "&times;",
                "&divide;"
            ];
            var opidx = 2;
            var startTime = Math.floor(Date.now() / 1000);
            var timerRunning = true;

            var queryString = function() {
                var decodeInt = function(str) {
                    return parseInt(decodeURIComponent(str), 10);
                }
                // http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
                if (window.location.search.length === 0)
                    return {};
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    // If first entry with this name
                    if (typeof query_string[pair[0]] === "undefined") {
                        query_string[pair[0]] = decodeInt(pair[1]);
                        // If second entry with this name
                    } else if (typeof query_string[pair[0]] === "string") {
                        var arr = [query_string[pair[0]], decodeInt(pair[1])];
                        query_string[pair[0]] = arr;
                        // If third or later entry with this name
                    } else {
                        query_string[pair[0]].push(decodeInt(pair[1]));
                    }
                }
                return query_string;
            }();
            function changeOp() {
                if (timerRunning) return;
                opidx++;
                if (opidx >= ops.length) {
                    opidx -= ops.length;
                }
                var opspan = document.getElementById("op");
                opspan.innerHTML = ops[opidx];
                //nextQuestion();
                document.getElementById("num1").innerHTML = "?";
                document.getElementById("num2").innerHTML = "?";
                document.getElementById("answer").value = "";
                document.getElementById("score").innerHTML = "";
            }
            function keyUp(e) {
                if (e.keyCode != 13 && e.keyCode != 110 && e.keyCode != 78)
                    return;
                var hasAnswer = timerRunning && /^[0-9]+$/.test(document.getElementById("answer").value);
                if (e.keyCode === 110) {
                    changeOp();
                } else if (e.keyCode === 13 && hasAnswer) {
                    checkAnswer();
                } else if (! timerRunning) {
                    if (e.keyCode == 78) {
                        opidx = getnum(0,3);
                        var opspan = document.getElementById("op");
                        opspan.innerHTML = ops[opidx];
                    }
                    nextQuestion();
                }
            }
            document.addEventListener('keyup', keyUp, true);
            function timerColor(elapsedSecs) {
                var lc = 5
                  , hc = 10;
                if ("lc" in queryString)
                    lc = queryString.lc;
                if ("hc" in queryString)
                    hc = queryString.hc;
                hc = Math.max(lc + 1, hc);
                var color = "black";
                if (elapsedSecs < lc) {
                    color = "green";
                } else if (elapsedSecs < hc) {
                    color = "orange";
                } else {
                    color = "red";
                }
                return color;
            }
            function startTimer() {
                var elapsedSecs = Math.floor(Date.now() / 1000) - startTime;
                var timer = document.getElementById("timer")
                timer.innerHTML = elapsedSecs;
                timer.style.color = timerColor(elapsedSecs);
                if (timerRunning)
                    setTimeout(startTimer, 500);
            }
            function getnum(low, high) {
                return Math.floor(Math.random() * (high - low + 1) + low);
            }
            function nextQuestion() {
                if (timerRunning && document.getElementById("answer").value.length === 0)
                    return;
                var l1 = 2
                  , h1 = 12
                  , l2 = 2
                  , h2 = 12;
                if ("l1" in queryString)
                    l1 = queryString.l1;
                if ("h1" in queryString)
                    h1 = queryString.h1;
                if ("l2" in queryString)
                    l2 = queryString.l2;
                if ("h2" in queryString)
                    h2 = queryString.h2;
                h1 = Math.max(l1 + 1, h1);
                h2 = Math.max(l2 + 1, h2);
                startTime = Math.floor(Date.now() / 1000);
                var in1 = getnum(l1, h1);
                var in2 = getnum(l2, h2);
                if (ops[opidx] === "&plus;" || ops[opidx] === "&times;") {
                  var num1 = in1;
                  var num2 = in2;
                } else if (ops[opidx] === "&minus;") {
                  var num1 = in1 + in2;
                  var num2 = in2;
                } else if (ops[opidx] === "&divide;") {
                  var num1 = in1 * in2;
                  var num2 = in2;
                }
                document.getElementById("num1").innerHTML = num1;
                document.getElementById("num2").innerHTML = num2;
                document.getElementById("answer").value = "";
                document.getElementById("score").innerHTML = "";
                document.getElementById("answer").focus();
                timerRunning = true;
                startTimer();
            }
            function checkAnswer() {
                if (!timerRunning)
                    return;
                timerRunning = false;
                document.getElementById("answer").blur();
                var num1 = document.getElementById("num1").innerHTML;
                var num2 = document.getElementById("num2").innerHTML;
                var answer = document.getElementById("answer").value;
                var score = document.getElementById("score");
                if (!/^[0-9]+$/.test(answer)) {
                    document.getElementById("score").innerHTML = "You need to enter a number";
                } else if (checkCalc(num1, num2, answer)) {
                    score.innerHTML = "Correct!";
                    score.style.color = "green";
                    addhistory(num1, num2, answer);
                } else {
                    document.getElementById("score").innerHTML = "Wrong!";
                    score.innerHTML = "Wrong!";
                    score.style.color = "red";
                    addhistory(num1, num2, answer);
                }
            }
            function checkCalc(num1, num2, ans) {
                var isCorrect = false;
                var n1 = parseInt(num1);
                var n2 = parseInt(num2);
                var a = parseInt(ans);
                if (ops[opidx] === "&plus;") {
                    isCorrect = n1+n2===a;
                } else if (ops[opidx] === "&minus;") {
                    isCorrect = n1-n2===a;
                } else if (ops[opidx] === "&times;") {
                    isCorrect = n1*n2===a;
                } else if (ops[opidx] === "&divide;") {
                    isCorrect = n1/n2===a;
                }
                return isCorrect;
            }
            function addhistory(num1, num2, answer) {
                var li = document.createElement("li");
                var span = document.createElement("span");
                span.innerHTML = num1 + " " + ops[opidx] + " " + num2 + " = " + answer;
                if (checkCalc(num1, num2, answer)) {
                    span.style.color = "green";
                } else {
                    span.style.color = "red";
                }
                li.appendChild(span);
                var timerSpan = document.createElement("span");
                var elapsedSecs = document.getElementById("timer").innerHTML;
                timerSpan.innerHTML = " (" + elapsedSecs + " seconds)";
                timerSpan.style.color = timerColor(elapsedSecs);
                li.appendChild(timerSpan);
                document.getElementById("history").appendChild(li);
            }
            function init() {
                var opspan = document.getElementById("op");
                opspan.addEventListener("click", changeOp, false);
                nextQuestion();
            }
            //var body = document.getElementsByTagName("body")[0];
            //body.addEventListener("load", init, false);
            //document.body.addEventListener("load", init, false);
        </script>
    </head>
    <body onload="init()">
        <p>
            <span class="large"><span id="num1">5</span> <span id="op" style="cursor: pointer">&times;</span> <span id="num2">4</span> =
            <span>
            <input class="large" type="text" id="answer" value="20" size="3"/> 
            </span>
            <span id="score"></span>
            </span>
        </p>
        <button class="button green" onclick="checkAnswer()">Check Answer</button>
        <button class="button blue" onclick="nextQuestion()">Next Question</button>
        &nbsp;
        <span id="timer" class="medium"></span>
        <ol id="history" class="medium"></ol>
    </body>
</html>
