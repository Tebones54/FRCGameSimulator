
	var theAuton = 3;
	var autonState = 0;
	var autonCounter = 0;
	var rampingValue = 0;

	function displayAuton(){
	//		var i = parseInt(document.getElementById("aselect1").value);
	//		document.getElementById("adescr1").innerHTML = aDescr[i];
	}

// initial offsets relative to centerline of the field
//				    0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
	var aPoseY=  [ 80, 90, 10, 50, 10,-78, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
	var PaPoseY1=[-70,-85,-70,-70,-70, 10,-70,-70,-70,-70,-70,-70,-70,-70,-70,-70];
	var PaPoseY2=[ 20, 40, 80, 90, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];

	var aDescr=["Go Forward Over Line",
				"Take Cube to Switch or just cross line",
				"Take Cube to Scale",
				"Smart Switch Score - Start Right/Center, Straight, Drop or go Left Drop",
				"Scale Then Switch",
				"smart left side switch scorer",
				"smart left side encoder/gyro"
				,"7","8","9","10","11","12","13","14","15"];

	function setInitalAutonPose(){
//		i = parseInt(document.getElementById("aselect1").value);
		i = theAuton;
		if(redalliance.checked){
			poseX = 120;
//			poseY = 151;
			poseY = centerline+aPoseY[i];
			poseR = 0;
		}else{
			poseX = 632;
//			poseY = 125;
			poseY = centerline-aPoseY[i];
			poseR = Math.PI;
		}
	}

/*  **************  Hardware Interface Functions  ************* */

	function HW_MySwitchIsLeft(){
		return (  FRC_MySwitchIsLeft() );
	}
	function HW_TheScaleIsLeft(){
		return (  FRC_TheScaleIsLeft() );
	}
	function HW_DisplayAutonDecision(){
		if ( HW_MySwitchIsLeft() )
			document.getElementById("decisionSW1").innerHTML = "LEFT";
		else
			document.getElementById("decisionSW1").innerHTML = "RIGHT";

		if ( HW_TheScaleIsLeft() )
			document.getElementById("decisionSC1").innerHTML = "LEFT";
		else
			document.getElementById("decisionSC1").innerHTML = "RIGHT";
	}
	function HW_LogTime(){
		mouseloc1.innerHTML=(150-matchClock)/10.0;
	}

	function auton_makeDecision(left,right){
		if (autonCounter > 0){
			if (HW_MySwitchIsLeft() ) autonState = left; else autonState = right;
			autonCounter = 0;
			HW_DisplayAutonDecision();
		}
	}
	function auton_driveArcade( spd, rot, cyc, next ){
		if (autonCounter <= cyc){
			Drive_Arcade(spd,rot);
		}else{
			autonState = next;
			autonCounter = 0;
		}
	}

	function auton_resetEncoder(){

	}

//	const kP_turn = 15;
	const kP_turn = 30;

	function auton_driveEncoder( dist, turn, timeout, next, error ){		// use - to decel
		var turn_rad = turn*(Math.PI/180);
		var turn_error = turn_rad-poseR;
//		var turn_error = poseZ-turn_rad;

		diag1.innerHTML = "turn_rad: "+turn_rad+" poseZ: "+poseR;

		if (autonCounter < timeout){
			Drive_Arcade(0,turn_error*kP_turn);
			if (( poseR < turn_rad+0.02)&&(poseR > turn_rad-0.02)){ // ish
				autonState = next;			// timeout
			}
		}else{
			autonState = error;			// timeout
			autonCounter = 0;
		}
	}
