
/*  **************  All functions in this section must be fully abstracted  ************* */

	function auton_0_goto1(){
		theAuton = 0;
		autonState = 1;
		autonCounter = 0;
		rampingValue = 0;
	}
	function auton_0(){
		switch(autonState){
			case 0:
				auton_makeDecision(1,1);		// just go straight after delay
				break;
			case 1:
				rampingValue++;
				auton_driveArcade(rampingValue,0,10,2);	// final ramp value = 10
				break;
			case 2:
				rampingValue--;
				auton_driveArcade(rampingValue,0,10,3);		// decel final ramp value = 0
				break;
			case 3:
				auton_driveArcade(0,0,10,4);		// keep sending 0
				break;
			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}
	}		// just go straight over line
	function auton_1(){
		switch(autonState){
			case 0:
				auton_makeDecision(101,1);		// left,right
				break;
			case 1:
				rampingValue++;
				auton_driveArcade(rampingValue,0,10,2);	// final ramp value = 10
				break;
			case 2:
				auton_driveArcade(rampingValue,0,1,3);		// coast
				break;
			case 3:
				rampingValue--;
				auton_driveArcade(rampingValue,0,10,4);		// decel final ramp value = 0
				break;
			case 4:
				auton_driveArcade(0,0,10,5);		// keep sending 0
				rampingValue=0;
				break;
			case 5:
				rampingValue--;
				auton_driveArcade(0,rampingValue,9,6);		// ramp up turn 90 deg
				break;
			case 6:
				rampingValue++;
				auton_driveArcade(0,rampingValue,9,7);		// ramp down turn 90 deg
				break;
			case 7:
				auton_driveArcade(0,0,10,8);		// keep sending 0
				rampingValue=0;
				break;
			case 8:
				rampingValue++;
				auton_driveArcade(rampingValue,0,5,9);
				break;
			case 9:
				throwCube();
				autonState = 10;
				rampingValue = 0;
			case 10:
				rampingValue--;
				auton_driveArcade(rampingValue,0,3,11);		// backup
				break;
			case 11:
				auton_driveArcade(0,0,10,12);		// keep sending 0
				autonCounter = 0;
				break;

			case 101:
				auton_0_goto1();
//				auton_driveArcade(10,0,11,102);	// left
				break;

			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}
	}
	function auton_2(){
		switch(autonState){
			case 0:
				if (autonCounter > adelay){
					autonState = 1;
					autonCounter = 0;
				}
				break;
			case 1:
				if (autonCounter <= 3){
					moveX(10);
				}else{
					autonState = 2;
					autonCounter = 0;
				}
				break;

			case 2:
				if (autonCounter <= 9){
					rotate(9);
				}else{
					autonState = 3;
					autonCounter = 0;
				}
				break;
			case 3:
				if (autonCounter <= 9){
					moveX(10);
				}else{
					autonState = 4;
					autonCounter = 0;
				}
				break;
			case 4:
				if (autonCounter <= 9){
					rotate(-9);
				}else{
					autonState = 5;
					autonCounter = 0;
				}
				break;
			case 5:
				if (autonCounter <= 21){
					moveX(10);
				}else{
					autonState = 6;
					autonCounter = 0;
				}
				break;
			case 6:
				if (autonCounter <= 9){
					rotate(-10);
				}else{
					autonState = 7;
					autonCounter = 0;
				}
				break;
			case 7:
				if (autonCounter <= 6){
					moveX(2);
				}else{
					pukeCube();
					autonState = 8;
					autonCounter = 0;
				}
				break;
			case 8:
				if (autonCounter <= 6){
					moveX(-2);
				}else{
					autonState = 9;
					autonCounter = 0;
					HW_LogTime();
				}
				break;

			default:
				break;
		}
	}
	function auton_2M(){				// mechanum
		switch(autonState){
			case 0:
				if (autonCounter < 3){
					moveX(10);
				}else{
					autonState = 1;
					autonCounter = 0;
				}
				break;

			case 1:
			case 2:
				if (autonCounter <= 7){
					moveY(10);
				}else{
					autonState = 3;
					autonCounter = 0;
				}
				break;
			case 3:
			case 4:
				if (autonCounter <= 10){
					moveX(8);
				}else{
					autonState = 5;
					autonCounter = 0;
				}
				break;
			case 5:
				if (autonCounter <= 9){
					rotate(-10);
				}else{
					autonState = 6;
					autonCounter = 0;
				}
				break;
			case 6:
				if (autonCounter <= 4){
					moveX(3);
				}else{
					autonState = 7;
					autonCounter = 0;
					HW_LogTime();
				}
				break;

			default:

				break;
		}
	}
	function auton_3(){
		switch(autonState){
			case 0:
				auton_makeDecision(1,101);		// left,right
				break;
			// Go Left   <<<-----------
			case 1:
				auton_driveArcade(9,0,3,2);
				break;
			case 2:
				auton_driveArcade(0,-9,9,3);
				break;
			case 3:
				auton_driveArcade(10,0,9,4);
				break;
			case 4:
				auton_driveArcade(0,9,9,5);
				break;
			case 5:
				if (autonCounter < 6){
					Drive_Arcade(9,0);
				}else{
					throwCube();
					Drive_Arcade(-9,0);
					autonState = 6;
					autonCounter = 0;
				}
				break;

			// Go Right   ----------->>>
			case 101:
				if (autonCounter < 10){
					Drive_Arcade(9,0);
				}else{
					Drive_Arcade(0,0);
					throwCube();
					autonState = 102;
					autonCounter = 0;
				}
				break;
			case 102:
				if (autonCounter < 3){
					Drive_Arcade(-5,0);
				}else{
					Drive_Arcade(0,0);
					autonState = 103;
					autonCounter = 0;
				}
				break;

			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}
	}		// smart
	function auton_4(){
		switch(autonState){
			case 0:
				if (autonCounter > adelay){
					autonState = 1;
					autonCounter = 0;
				}
				break;
			case 1:
				if (autonCounter <= 3){
					moveX(10);
				}else{
					autonState = 2;
					autonCounter = 0;
				}
				break;

			case 2:
				if (autonCounter <= 9){
					rotate(10);
				}else{
					autonState = 3;
					autonCounter = 0;
				}
				break;
			case 3:
				if (autonCounter <= 8){
					moveX(10);
				}else{
					autonState = 4;
					autonCounter = 0;
				}
				break;
			case 4:
				if (autonCounter <= 9){
					rotate(-10);
				}else{
					autonState = 5;
					autonCounter = 0;
				}
				break;
			case 5:
				if (autonCounter <= 21){
					moveX(9);
				}else{
					autonState = 6;
					autonCounter = 0;
				}
				break;
			case 6:
				if (autonCounter <= 9){
					rotate(-10);
				}else{
					autonState = 7;
					autonCounter = 0;
				}
				break;
			case 7:
				if (autonCounter <= 6){
					moveX(2);
				}else{
					pukeCube();
					autonState = 8;
					autonCounter = 0;
				}
				break;
			case 8:
				if (autonCounter <= 6){
					moveX(-2);
				}else{
					autonState = 9;
					autonCounter = 0;
				}
				break;
			case 9:
				if (autonCounter <= 9){
					rotate(-10);
				}else{
					autonState = 10;
					autonCounter = 0;
				}
				break;
			case 10:
				if (autonCounter <= 6){
					moveX(8);
				}else{
					autonState = 11;
					autonCounter = 0;
				}
				break;
			case 11:
				if (autonCounter <= 5){
					rotate(9);
				}else{
					autonState = 12;
					autonCounter = 0;
				}
				break;
			case 12:
				if (autonCounter <= 4){
					moveX(8);
				}else{
					grabCube();
					autonState = 13;
					autonCounter = 0;
				}
				break;
			case 13:
				if (autonCounter > 10){
					grabCube();
					autonState = 14;
					autonCounter = 0;
				}
				break;
			case 14:
				if (autonCounter < 2){
					moveX(5);
				}else{
					throwCube();
					autonState = 15;
					autonCounter = 0;
				}
				break;
			case 15:
				if (autonCounter < 2){
					moveX(-5);
				}else{
					autonState = 16;
					autonCounter = 0;
				}
				break;

			case 999:
				break;
			default:
				HW_LogTime();
				autonState = 999;
				break;
		}
	}
	function auton_5(){
		switch(autonState){
			case 0:
				auton_makeDecision(1,101);		// just go straight after delay
				break;
			case 1:
				rampingValue++;
				auton_driveArcade(rampingValue,0,10,2);	// final ramp value = 10
				break;
			case 2:
				rampingValue--;
				auton_driveArcade(rampingValue,0,10,3);		// decel final ramp value = 0
				break;
			case 3:
				auton_driveArcade(0,0,5,31);		// keep sending 0
				break;
			case 31:
				rampingValue = 0;
				autonState = 4;
			case 4:
				rampingValue++;
				auton_driveArcade(0,rampingValue,9,5);		// ramp up turn 90 deg
				break;
			case 5:
				rampingValue--;
				auton_driveArcade(0,rampingValue,9,6);		// ramp down turn 90 deg
				break;
			case 6:
				auton_driveArcade(0,0,10,7);		// keep sending 0
				rampingValue=0;
				break;
			case 7:
				rampingValue++;
				auton_driveArcade(rampingValue,0,4,8);
				break;
			case 8:
				auton_driveArcade(0,0,10,9);		// keep sending 0
				rampingValue=0;
				break;
			case 9:
				pukeCube();
				autonState = 10;
				autonCounter = 0;
				break;

			case 101:
				auton_0_goto1();
//				auton_driveArcade(10,0,11,102);	// left
				break;


			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}
	}		// smart left side switch scorer
	function auton_6(){
		switch(autonState){
			case 0:
				auton_makeDecision(1,1);		// just go straight after delay
				break;
			case 1:
				rampingValue++;
				auton_driveArcade(rampingValue,0,10,2);	// final ramp value = 10
				break;
			case 2:
				rampingValue--;
				auton_driveArcade(rampingValue,0,10,3);		// decel final ramp value = 0
				break;
			case 3:
				auton_driveArcade(0,0,10,4);		// keep sending 0
				break;
			case 4:
				auton_resetEncoder();
				autonState = 5;
			case 5:
				auton_driveEncoder(0, 90, 200, 6, 888);
				break;

			// error - timeout
			case 888:
				break;
			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}
	}
	function auton_7(){
		switch(autonState){
			case 0:
				auton_makeDecision(1,1);					// just go straight after delay
				break;
			case 1:
				if (autonCounter <= 10){
					rampingValue+= 0.1;
					Drive_Arcade2(rampingValue,0);		// final ramp value = 1.0
				}else{
					autonState = 2;
					autonCounter = 0;
				}
				break;
			case 2:
				if (autonCounter <= 10){
					rampingValue-= 0.1;
					Drive_Arcade2(rampingValue,0);		// decel final ramp value = 0
				}else{
					autonState = 3;
					autonCounter = 0;
				}
				break;
			case 3:
				break;
			case 4:
				auton_resetEncoder();
				autonState = 5;
			case 5:
//				auton_driveEncoder(0, 90, 200, 6, 888);
				break;

			// error - timeout
			case 888:
				break;
			case 99:
				break;
			default:
				autonState = 99;
				HW_LogTime();
				break;
		}

	}
/********************START HERE****************************/

	function auton_8(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}

	function auton_9(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}

	function auton_10(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}

	function auton_11(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}

	function auton_12(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}

	function auton_13(){
			switch (autonState) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				default:
					break;
			}
	}



	// This is the entry vector common to both the simulator and the actual robot

	function autonInit(){
		autonState = 0;
		autonCounter = 0;
		rampingValue = 0;
	}

	function autonPeriodic(){
		switch(theAuton){
			case 0:
				auton_0();
				break;
			case 1:
				auton_1();
				break;
			case 2:
				auton_2();
				break;
			case 3:
				auton_3();
				break;
			case 4:
				auton_4();
				break;
			case 5:
				auton_5();
				break;
			case 6:
				auton_6();
				break;
			case 7:
				auton_7();
				break;
			case 8:
				break;
			case 9:
				break;
			case 10:
				break;
			case 11:
				break;
			case 12:
				break;
			case 13:
				break;
			default:
				break;
		}
		autonCounter++;
	}
/******************* METHOD USAGES **************************
auton_driveArcade(speed,rotate,maxSpeedValue,nextState);
auton_makeDecision(leftState,rightState)
Don't use drive arcade 2 YET. Ya boi can make it work eventually



************************************************************/
