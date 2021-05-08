# 999DiceBot
 
This script was written to automate the betting process on 999Dice.com

At the moment it is set to 79% Chance to Win and 500% increase after loss.

Logic steps
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
	