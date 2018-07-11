
	var theAuton2 = 3;
	var autonState2 = 0;
	var autonCounter2 = 0;

	function displayAuton2(){
		var i = parseInt(document.getElementById("aselect2").value);
		document.getElementById("a2Descr").innerHTML = a2Descr[i];
	}

	function autonEnable2(){
		// theAuton2 = parseInt(document.getElementById("aselect2").value);
		adelay2 = 10*(document.getElementById("adelay2").value);
//
//		if (document.getElementById("rand").checked) {
//			redswitch = Math.random();	// 0..1
//			blueswitch = Math.random();
//			scale = Math.random();
//		}
//		drawField();
////		mouseloc1.innerHTML = "RedSW "+redswitch+"BlueSW "+blueswitch+"Scale "+scale;
		auton2Init();
	}

// initial offsets relative to centerline of the field
//					0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
	var a2PoseY= [ 80, 85, 10, 50, 10,-78, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
	var a2PoseY1=[-70,-85,-70,-70,-70, 10,-70,-70,-70,-70,-70,-70,-70,-70,-70,-70];
	var a2PoseY2=[ 20, 40, 80, 90, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];

//	var centerline = 137;

	var a2Descr=["Go Forward Over Line",
				"Take Cube to Switch or just cross line",
				"Take Cube to Scale",
				"Smart Switch Score - Start Right/Center, Straight, Drop or go Left Drop",
				"Scale Then Switch",
				"5","6","7","8","9","10","11","12","13","14","15"];

	function setInitalAutonPose_opponents(){
//		i = parseInt(document.getElementById("aselect2").value);
		i = theAuton;
		if(!redalliance.checked){
			OposeX[0] = 120;
			OposeY[0] = centerline+a2PoseY[i];;
			OposeR[0] = 0;
			OposeX[1] = 120;
			OposeY[1] = centerline+a2PoseY1[i];;
			OposeR[1] = 0;
			OposeX[2] = 120;
			OposeY[2] = centerline+a2PoseY2[i];;
			OposeR[2] = 0;
//			poseY = centerline+aPoseY[i];
		}else{
			OposeX[0] = 633;
			OposeY[0] = centerline-a2PoseY[i];;
			OposeR[0] = Math.PI;
			OposeX[1] = 633;
			OposeY[1] = centerline-a2PoseY1[i];;
			OposeR[1] = Math.PI;
			OposeX[2] = 633;
			OposeY[2] = centerline-a2PoseY2[i];;
			OposeR[2] = Math.PI;
//			poseY = centerline-aPoseY[i];
		}
	}

/*  **************  Hardware Interface Functions  ************* */

	function FRC2_MySwitchIsLeft(){
		return ( colors2.innerHTML.charAt(0) == "L" );
	}
	function FRC2_TheScaleIsLeft(){
		return ( colors2.innerHTML.charAt(1) == "L" );
	}

	function HW2_MySwitchIsLeft(){
		return (  FRC2_MySwitchIsLeft() );
	}
	function HW2_TheScaleIsLeft(){
		return (  FRC2_TheScaleIsLeft() );
	}
	function HW2_DisplayAutonDecision(){
		if ( HW2_MySwitchIsLeft() )
			document.getElementById("decisionSW2").innerHTML = "GO LEFT";
		else
			document.getElementById("decisionSW2").innerHTML = "GO RIGHT";

		if ( HW2_TheScaleIsLeft() )
			document.getElementById("decisionSC2").innerHTML = "GO LEFT";
		else
			document.getElementById("decisionSC2").innerHTML = "GO RIGHT";
	}
	function HW2_LogTime(){
		mouseloc1.innerHTML=(150-matchClock)/10.0;
	}

/*  **************  All functions in this section must be fully abstracted  ************* */

	function auton2_makeDecision(left,right){
		if (autonCounter2 > adelay2){
			if (HW2_MySwitchIsLeft() ) autonState2 = left; else autonState2 = right;
			autonCounter2 = 0;
			HW2_DisplayAutonDecision();
		}
	}
	function auton2_driveArcade( spd, rot, cyc, next ){
		if (autonCounter2 <= cyc){
			Drive_Arcade_opponent(spd,rot,0);
		}else{
			autonState2 = next;
			autonCounter2 = 0;
		}
	}

	function auton2_0(){
		switch(autonState2){
			case 0:
				auton2_makeDecision(1,1);		// just go straight after delay
				break;
			case 1:
				auton2_driveArcade(10,0,10,2);
				break;
			case 99:
				break;
			default:
				autonState2 = 99;
				HW_LogTime();
				break;
		}
	}		// just go straight over line
	function auton2_1(){
		switch(autonState2){
			case 0:
				auton2_makeDecision(101,1);		// left,right
				break;
			case 1:
				auton2_driveArcade(10,0,13,2);	// right
				break;
			case 2:
				auton2_driveArcade(0,-10,9,3);
				break;
			case 3:
				auton2_driveArcade(4,0,4,4);
				break;
			case 4:
				throwCube_opponent(0);
				autonState2 = 5;
				autonCounter2 = 0;
				break;

			case 101:
				auton2_driveArcade(10,0,11,102);	// left
				break;

			case 99:
				break;
			default:
				autonState2 = 99;
				HW_LogTime();
				break;
		}
	}
	function auton2_2(){
		switch(autonState2){
			case 0:
				if (autonCounter2 > adelay2){
					autonState2 = 1;
					autonCounter2 = 0;
				}
				break;
			case 1:
				if (autonCounter2 <= 3){
					moveX_opponent(10,0);
				}else{
					autonState2 = 2;
					autonCounter2 = 0;
				}
				break;

			case 2:
				if (autonCounter2 <= 9){
					rotate_opponent(10,0);
				}else{
					autonState2 = 3;
					autonCounter2 = 0;
				}
				break;
			case 3:
				if (autonCounter2 <= 8){
					moveX_opponent(10,0);
				}else{
					autonState2 = 4;
					autonCounter2 = 0;
				}
				break;
			case 4:
				if (autonCounter2 <= 9){
					rotate_opponent(-10,0);
				}else{
					autonState2 = 5;
					autonCounter2 = 0;
				}
				break;
			case 5:
				if (autonCounter2 <= 21){
					moveX_opponent(9,0);
				}else{
					autonState2 = 6;
					autonCounter2 = 0;
				}
				break;
			case 6:
				if (autonCounter2 <= 9){
					rotate_opponent(-10,0);
				}else{
					autonState2 = 7;
					autonCounter2 = 0;
				}
				break;
			case 7:
				if (autonCounter2 <= 6){
					moveX_opponent(2);
				}else{
					pukeCube_opponent(0);
					autonState2 = 8;
					autonCounter2 = 0;
				}
				break;
			case 8:
				if (autonCounter2 <= 6){
					moveX_opponent(-2,0);
				}else{
					autonState2 = 9;
					autonCounter2 = 0;
					HW_LogTime();
				}
				break;

			default:
				break;
		}
	}
	function auton2_2M(){				// mechanum
		switch(autonState2){
			case 0:
				if (autonCounter2 < 3){
					moveX_opponent(10,0);
				}else{
					autonState2 = 1;
					autonCounter2 = 0;
				}
				break;

			case 1:
			case 2:
				if (autonCounter2 <= 7){
					moveY(10,0);
				}else{
					autonState2 = 3;
					autonCounter2 = 0;
				}
				break;
			case 3:
			case 4:
				if (autonCounter2 <= 10){
					moveX_opponent(8,0);
				}else{
					autonState2 = 5;
					autonCounter2 = 0;
				}
				break;
			case 5:
				if (autonCounter2 <= 9){
					rotate_opponent(-10,0);
				}else{
					autonState2 = 6;
					autonCounter2 = 0;
				}
				break;
			case 6:
				if (autonCounter2 <= 4){
					moveX_opponent(3,0);
				}else{
					autonState2 = 7;
					autonCounter2 = 0;
					HW_LogTime();
				}
				break;

			default:

				break;
		}
	}
	function auton2_3(){
		switch(autonState2){
			case 0:
				auton2_makeDecision(1,101);		// left,right
				break;
			// Go Left   <<<-----------
			case 1:
				auton2_driveArcade(9,0,3,2);
				break;
			case 2:
				auton2_driveArcade(0,-9,9,3);
				break;
			case 3:
				auton2_driveArcade(10,0,9,4);
				break;
			case 4:
				auton2_driveArcade(0,9,9,5);
				break;
			case 5:
				if (autonCounter2 < 6){
					Drive_Arcade_opponent(9,0,0);
				}else{
					throwCube_opponent(0);
					Drive_Arcade_opponent(-9,0,0);
					autonState2 = 6;
					autonCounter2 = 0;
				}
				break;

			// Go Right   ----------->>>
			case 101:
				if (autonCounter2 < 10){
					Drive_Arcade_opponent(9,0,0);
				}else{
					Drive_Arcade_opponent(0,0,0);
					throwCube_opponent(0);
					autonState2 = 102;
					autonCounter2 = 0;
				}
				break;
			case 102:
				if (autonCounter2 < 3){
					Drive_Arcade_opponent(-5,0,0);
				}else{
					Drive_Arcade_opponent(0,0,0);
					autonState2 = 103;
					autonCounter2 = 0;
				}
				break;

			case 99:
				break;
			default:
				autonState2 = 99;
				HW_LogTime();
				break;
		}
	}		// smart
	function auton2_4(){
		switch(autonState2){
			case 0:
				if (autonCounter2 > adelay2){
					autonState2 = 1;
					autonCounter2 = 0;
				}
				break;
			case 1:
				if (autonCounter2 <= 3){
					moveX_opponent(10);
				}else{
					autonState2 = 2;
					autonCounter2 = 0;
				}
				break;

			case 2:
				if (autonCounter2 <= 9){
					rotate_opponent(10);
				}else{
					autonState2 = 3;
					autonCounter2 = 0;
				}
				break;
			case 3:
				if (autonCounter2 <= 8){
					moveX_opponent(10);
				}else{
					autonState2 = 4;
					autonCounter2 = 0;
				}
				break;
			case 4:
				if (autonCounter2 <= 9){
					rotate_opponent(-10);
				}else{
					autonState2 = 5;
					autonCounter2 = 0;
				}
				break;
			case 5:
				if (autonCounter2 <= 21){
					moveX_opponent(9);
				}else{
					autonState2 = 6;
					autonCounter2 = 0;
				}
				break;
			case 6:
				if (autonCounter2 <= 9){
					rotate_opponent(-10);
				}else{
					autonState2 = 7;
					autonCounter2 = 0;
				}
				break;
			case 7:
				if (autonCounter2 <= 6){
					moveX_opponent(2);
				}else{
					pukeCube_opponent();
					autonState2 = 8;
					autonCounter2 = 0;
				}
				break;
			case 8:
				if (autonCounter2 <= 6){
					moveX_opponent(-2);
				}else{
					autonState2 = 9;
					autonCounter2 = 0;
				}
				break;
			case 9:
				if (autonCounter2 <= 9){
					rotate_opponent(-10);
				}else{
					autonState2 = 10;
					autonCounter2 = 0;
				}
				break;
			case 10:
				if (autonCounter2 <= 6){
					moveX_opponent(8);
				}else{
					autonState2 = 11;
					autonCounter2 = 0;
				}
				break;
			case 11:
				if (autonCounter2 <= 5){
					rotate_opponent(9);
				}else{
					autonState2 = 12;
					autonCounter2 = 0;
				}
				break;
			case 12:
				if (autonCounter2 <= 4){
					moveX_opponent(8);
				}else{
					grabCube();
					autonState2 = 13;
					autonCounter2 = 0;
				}
				break;
			case 13:
				if (autonCounter2 > 10){
					grabCube();
					autonState2 = 14;
					autonCounter2 = 0;
				}
				break;
			case 14:
				if (autonCounter2 < 2){
					moveX_opponent(5);
				}else{
					throwCube();
					autonState2 = 15;
					autonCounter2 = 0;
				}
				break;
			case 15:
				if (autonCounter2 < 2){
					moveX_opponent(-5);
				}else{
					autonState2 = 16;
					autonCounter2 = 0;
				}
				break;

			case 999:
				break;
			default:
				HW_LogTime();
				autonState2 = 999;
				break;
		}
	}
	function auton2_5(){}
	function auton2_6(){}
	function auton2_7(){}

	// This is the entry vector common to both the simulator and the actual robot
	function auton2Init(){
		autonState2 = 0;
		autonCounter2 = 0;
	}

	function autonPeriodic2(){
		switch(theAuton2){
			case 0:
				auton2_0();
				break;
			case 1:
				auton2_1();
				break;
			case 2:
				auton2_2();
				break;
			case 3:
				auton2_3();
				break;
			case 4:
				auton2_4();
				break;
			case 5:
				auton2_5();
				break;
			case 6:
				auton2_6();
				break;
			case 7:
				auton2_7();
				break;
			default:
				break;
		}
		autonCounter2++;

//		Drive_Arcade_opponent(1,0,1);
//		Drive_Arcade_opponent(1,0,2);
	}
