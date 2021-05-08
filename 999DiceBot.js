// ==UserScript==
// @name         999Dice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.999dice.com/*
// ==/UserScript==

/*
Logic Steps
	1)	Set values to all input fields
		a)	betSize = 0.01
		b)	chanceToWin = 79
		c)	baseBettingSize = (see step 3)
		d)	autoChanceToWin = 79
		e)	autoNumberOfBets = 200
		f)	increaseOnLoss = 500
		g)	Click on AutoBetResetOnLoss
	2)	Click Automatic Betting Tab
	3)	Calculate the baseBettingSize
		a)	Get the balance
		b)	Divide balance by the factor for maximum loss run (see Chart 1)
		c)	Multiply (3b) by 100,000,000
		d)	Round down to the nearest whole number
		e)	Divide (3d) by 100,000,000 converting to a maximum of 8 decimal places
		f)	Assign answer to baseBettingSize
	4)	Get oldAutoBetID
	5)	Click autoBetHigh
	6)	Get lastAutoBetID
	7)	Compare oldAutoBetID and lastAutoBetID
		a)	If they equal each other return to Step 6
		b)	If they are different then continue
	8)	betBatchDetails = “#BetBatchDetails” + lastAutoBetID  + “> td:nth-child(5) > span”
	9)	Get profit of the last bet in betBatchDetails
		a)	If value is positive, then return to Step 3
		b)	If value is negative, then assign loss to betLoss and then continue
	10)	Open Single Bets Tab
	11)	Get oldBalance
	12)	Calculate betSize
		a)	multiply betLoss by 3.78
		b)	populate betSize
	13)	Click betHigh
	14)	Compare balance and oldBalance
		a)	If win then return to Step 2
		b)	If lose then betLoss = oldBalance – balance
		c)	Return to Step 11
*/
(function() {

    // Variables defined
    console.log("Set Variables");
    var balance = parseFloat(document.querySelector(".UserBalance").innerText);
    var oldBalance = balance;
    var betSize = 0.01;
    var chanceToWin = 79;
    var autoNumberOfBets = 200;
    var increaseOnLoss = 5;
    // Uncomment the minimum risk you want to take
    // 	var maxRisk = 1; // 1 consecutive red
    // 	var maxRisk = 6; // 2 consecutive red
    // 	var maxRisk = 31; // 3 consecutive red
    // 	var maxRisk = 156; // 4 consecutive red
    // 	var maxRisk = 781; // 5 consecutive red
    // 	var maxRisk = 3906; // 6 consecutive red
    // 	var maxRisk = 19531; // 7 consecutive red
    // 	var maxRisk = 97656; // 8 consecutive red
    // 	var maxRisk = 488281; // 9 consecutive red
    var maxRisk = 2441406; // 10 consecutive red
    // 	var maxRisk = 12207031; // 11 consecutive red
    // 	var maxRisk = 61035156; // 12 consecutive red
    // 	var maxRisk = 305175781; // 13 consecutive red
    // 	var maxRisk = 1525878906; // 14 consecutive red
    //	var maxRisk = 7629394531; // 15 consecutive red
    var oldAutoBetID;
    var lastAutoBetID;
    var betBatchDetails;
    var lastAutoBetResults;
    var str1 = "#BetBatchDetails";
    var str2 = " > td:nth-child(5) > span";
    var betLoss = new Array; 
    var stepper = 1;
    var nextBet;

    function step01() {
        step03(); // Get betSize for initial setup
        console.log("Initializing... Please Standby...");
        document.querySelector("#AutoBetResetOnLoss").click();
        document.querySelector("#BetSizeInput").value = betSize;
        document.querySelector("#BetChanceInput").value = chanceToWin;
        document.querySelector("#AutoBetSizeInput").value = betSize;
        document.querySelector("#AutoBetChanceInput").value = chanceToWin;
        document.querySelector("#AutoBetNumBets").value = autoNumberOfBets;
        document.querySelector("#AutoBetIncreaseOnLoss").value = (increaseOnLoss * 100) - 100;
        stepper = 2;
        return;
    }
    function step02() {
        document.querySelector("#AutoBetsActionTabButton").click();
        stepper = 3;
        return;

    }
    function step03() {
        balance = parseFloat(document.querySelector(".UserBalance").innerText);
        betSize = Math.floor((balance / maxRisk) * 100000000) / 100000000;
        if (betSize < 0.00000004) {
            betSize = 0.00000004;
        }
        stepper = 4;
        return;
    }
    function step04() {
         if (document.querySelector("#LastAutoBetInfoID").innerText == "") {
            oldAutoBetID = 0;
        } else {
            oldAutoBetID = parseInt(document.querySelector("#LastAutoBetInfoID").innerText);
        }
        stepper = 5;
        return;
    }
    function step05() {
        //Step 5 - Click Bet High button
        document.querySelector("#AutoBetHighButton > span").click();
        stepper = 6;
        return;
    }
    function step06() {
        //Step 6
        if (document.querySelector("#LastAutoBetInfoID").innerText == "") {
            lastAutoBetID = 0;
        } else {
            lastAutoBetID = parseInt(document.querySelector("#LastAutoBetInfoID").innerText);
        }
        stepper = 7;
        return;
    }
    function step07() {
        //Step 7 - Compare oldAutoBetID and lastAutoBetID
        if (oldAutoBetID == lastAutoBetID) {
            stepper = 6;
            return;
        }
        stepper = 8;
        return;
    }
    function step08() {
        //Step 8 - 
        betBatchDetails = str1 + lastAutoBetID.toString() + str2;
        stepper = 9;
        return;
    }
    function step09() {
        //Step 9 - 
        lastAutoBetResults = parseFloat(document.querySelector(betBatchDetails).innerText);
        if (lastAutoBetResults == Math.abs(lastAutoBetResults)) {
            stepper = 3;
            return;
        }
        stepper = 10;
        return;
    }
    function step10() {
        //Step 10
        document.querySelector("#SingleBetsButton").click();
        stepper = 11;
        return;
    }
    function step11() {
        //Step 11
        oldBalance = parseFloat(document.querySelector(".UserBalance").innerText);
        stepper = 12;
        return;
    }
    function step12() {
        //Step 12
        nextBet = Math.floor((Math.abs(lastAutoBetResults) * increaseOnLoss) * 100000000) / 100000000;
        
        document.querySelector("#BetSizeInput").value = nextBet;
        stepper = 13;
        return;
    }
    function step13() {
        //Step 13
        document.querySelector("#BetHighButton > span.BetControlTitle").click();
        stepper = 14;
        return;
    }
    function step14() {
        //Step 14
        balance = parseFloat(document.querySelector(".UserBalance").innerText);
        if (balance > oldBalance) {
            stepper = 2;
            return;
        }
        if (balance < oldBalance) {
            lastAutoBetResults = nextBet;
            stepper = 11;
            return;
        }
        if (balance == oldBalance) {
            stepper = 14;
            return;
        }
    }
    function dice() {
        if (stepper == 1) {
            step01();
        }
        if (stepper == 2) {
            step02();
        }
        if (stepper == 3) {
            step03();
        }
        if (stepper == 4) {
            step04();
        }
        if (stepper == 5) {
            step05();
        }
        if (stepper == 6) {
            step06();
        }
        if (stepper == 7) {
            step07();
        }
        if (stepper == 8) {
            step08();
        }
        if (stepper == 9) {
            step09();
        }
        if (stepper == 10) {
            step10();
        }
        if (stepper == 11) {
            step11();
        }
        if (stepper == 12) {
            step12();
        }
        if (stepper == 13) {
            step13();
        }
        if (stepper == 14) {
            step14();
        }
        setTimeout(function(){
			dice();
		}, 100);
    }
    setTimeout(function(){
        dice();
    }, 10000);

})();

//document.querySelector("#ChatTab > div:nth-child(2) > p > span") // Rain Tab