	var PposeX = [50,50];
	var PposeY = [100,50];
	var PposeR = [0,0,0];
	var PposeZ = [0,0,0];
	
	var ProbotW = [23,23];
	var ProbotL = [28,28];
	var ProbotH = [46,46];

	var PgrbZoneX = [13,13];			// relative to 0,0 center of robot
	var PgrbZoneY = [-8,-8];
	var PgrbZoneW = [15,15];
	var PgrbZoneH = [15,15];
	
	var PhasCube = [true,true];
	var PtheCube = [33,34];			// initial cube and subsequent ones	

	var pDroneMode = [2,0,0];					// 0 = do nothing, 1..n = strategies
	var pDroneModeCounter = [0,0,0];
	
	function initRobot_partners(){
		PhasCube = [true,true];
		PtheCube = [33,34];
	}

	function drawRobot_partner(ix){
		if (redalliance.checked) ctx.strokeStyle = "red"; else ctx.strokeStyle = "blue";
		ctx.lineWidth = 9;
		ctx.fillStyle = "#AAA";
		ctx.translate(PposeX[ix],PposeY[ix]);
		ctx.rotate(PposeR[ix]);
		ctx.strokeRect(-(ProbotW[ix]/2), -(ProbotL[ix]/2),ProbotW[ix],ProbotL[ix]);
		ctx.fillRect(-(ProbotW[ix]/2), -(ProbotL[ix]/2),ProbotW[ix],ProbotL[ix]);
		
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "white";
		ctx.moveTo(0,0);
		ctx.lineTo(10,0);
		ctx.stroke();

		if (PhasCube[ix]){
			ctx.strokeStyle = "#DAA520";
			ctx.fillStyle = "yellow";
			ctx.lineWidth=1;
			ctx.strokeRect(0,-5,10,10);
			ctx.fillRect(0,-5,10,10);
		}else{
			ctx.strokeStyle = "#DAA520";
			ctx.fillStyle = "yellow";
			ctx.lineWidth=1;
//			ctx.strokeRect(13,-8,15,15);			// make these values common
			ctx.strokeRect(PgrbZoneX[ix],PgrbZoneY[ix],PgrbZoneW[ix],PgrbZoneH[ix]);
		}
		ctx.strokeStyle = "black";
		ctx.strokeText( (ix == 0)?"1":"2",-10,-5);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	function clearRobot_partner(ix){
		ctx.translate(PposeX[ix],PposeY[ix]);
		ctx.rotate(PposeR[ix]);
		ctx.clearRect(-(ProbotW[ix]/2)-6, -(ProbotL[ix]/2)-6,ProbotW[ix]+12,ProbotL[ix]+12);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	function moveX_partner(x,ix){
		clearRobot_partner(ix);
		PposeX += x*(Math.cos(PposeR[ix]) );
		PposeY += x*(Math.sin(PposeR[ix]) );
		drawRobot_partner(ix);
	}
	function moveY_partner(y,ix){
		clearRobot_partner(ix);
		PposeX[ix] += y*(Math.sin(-PposeR[ix]) );
		PposeY[ix] += y*(Math.cos(PposeR[ix]) );
		drawRobot_partner(ix);
	}
	function moveSR_partner(speed,rotate,ix){
		var prevX = PposeX[ix];
		var prevY = PposeY[ix];

		if (PposeZ[ix] == 0){		
			clearRobot_partner(ix);
			PposeX[ix] += speed*(Math.cos(PposeR[ix]));
			PposeY[ix] += speed*(Math.sin(PposeR[ix]));
			if (PposeX[ix] < CX1) PposeX[ix] = CX1;
			else if (PposeX[ix] > CX2) PposeX[ix] = CX2;
			if (PposeY[ix] < CY1) PposeY[ix] = CY1;
			else if (PposeY[ix] > CY2) PposeY[ix] = CY2;
			
			if ( (PposeX[ix] > (SWR_Fence_X-(robotW/2)))&&(PposeX[ix] < (SWR_Fence_X2+(robotW/2)))&&(PposeY[ix] > (SWR_Fence_Y-(robotL/2)))&&(PposeY[ix] < (SWR_Fence_Y2+(robotL/2))))
			{
				PposeX[ix] = prevX;
				PposeY[ix] = prevY;
			}
			else if ( (PposeX[ix] > (SWB_Fence_X-(robotW/2)))&&(PposeX[ix] < (SWB_Fence_X2+(robotW/2)))&&(PposeY[ix] > (SWB_Fence_Y-(robotL/2)))&&(PposeY[ix] < (SWB_Fence_Y2+(robotL/2))))
			{
				PposeX[ix] = prevX;
				PposeY[ix] = prevY;
			}
			else if ( (PposeX[ix] > SCA_Base_X)&&(PposeX[ix] < SCA_Base_X2)&&(PposeY[ix] > SCA_Base_Y)&&(PposeY[ix] < SCA_Base_Y2) )
			{
				PposeX[ix] = prevX;
				PposeY[ix] = prevY;
			}
			
			PposeR[ix] += rotate*(Math.PI/180);
			drawRobot_partner(ix);
		}
	}
	
	function rotate_partner(r,ix){
		clearRobot_partner(ix);
		PposeR[ix] += r*(Math.PI/180);
		drawRobot_partner(ix);
	}
	function pukeCube_partner(ix){
		cubeX[PtheCube[ix]] = PposeX[ix]+(20*Math.cos(PposeR[ix]));
		cubeY[PtheCube[ix]] = PposeY[ix]+(20*Math.sin(PposeR[ix]));
		// check to see if scored or on field
		cube[PtheCube[ix]] = 2;
		PhasCube[ix] = false;
	}
	function throwCube_partner(ix){
		cubeX[PtheCube[ix]] = PposeX[ix]+(40*Math.cos(PposeR[ix]));
		cubeY[PtheCube[ix]] = PposeY[ix]+(40*Math.sin(PposeR[ix]));
		// check to see if scored or on field
		cube[PtheCube[ix]] = 2;
		PhasCube[ix] = false;
		FRC_checkForScore(PtheCube[ix]);
		FRC_checkForExchange(PtheCube[ix]);
	}	
	function grabCube_partner(ix){
		var X;
		var Y;

		for (i=0; i< maxCubes; i++){
			if (cube[i] == 2){
				
				newPoseX = PposeX[ix] + 17 * Math.cos(PposeR[ix]);
				newPoseY = PposeY[ix] + 17 * Math.sin(PposeR[ix]);
				X = cubeX[i]-newPoseX;
				Y = cubeY[i]-newPoseY;
	
				dist = Math.sqrt((X*X)+(Y*Y));
				if (dist < 10){
					PtheCube[ix] = i;
					cube[PtheCube[ix]] = 1;
					PhasCube[ix] = true;
					break;
				}
			}
		}
	}

	function Drive_Arcade_partner(speed,rotate,ix){
		moveSR_partner(speed,rotate,ix);
	}

	function pDrone_makeDecision(left,right,ix){
		if (HW_MySwitchIsLeft() ) tp_state[ix] = left; else tp_state[ix] = right;
		tp_counter[ix] = 0;
	}
	function pDrone_driveArcade( spd, rot, cyc, next, ix ){
		if (tp_counter[ix] <= cyc){
			Drive_Arcade_partner(spd,rot,ix);				
		}else{
			tp_state[ix] = next;
			tp_counter[ix] = 0;
		}
	}

/* --------------    Autons   ---------------------- */

	function setInitalAutonPose_partners(){
		i = parseInt(document.getElementById("aselect1").value);
		if(redalliance.checked){
			PposeX[0] = 120;
			PposeY[0] = centerline+PaPoseY1[i];
			PposeR[0] = 0;
			PposeX[1] = 120;
			PposeY[1] = centerline+PaPoseY2[i];
			PposeR[1] = 0;
		}else{
			PposeX[0] = 632;
			PposeY[0] = centerline-PaPoseY1[i];
			PposeR[0] = Math.PI;
			PposeX[1] = 632;
			PposeY[1] = centerline-PaPoseY2[i];
			PposeR[1] = Math.PI;
		}
	}

/*   *******************   Drone Partners   ***************************  */

	var tp_state = [];
	tp_state[0] = 0;
	tp_state[1] = 0;
	var tp_counter = [];
	tp_counter[0] = 0;
	tp_counter[1] = 0;

	function initTeleop(){
		tp_state[0] = 0;
		tp_state[1] = 0;
		tp_counter[0] = 0;
		tp_counter[1] = 0;
	}

	function tp_Mode_2(ix){
		switch(tp_state[ix]){
			case 0:
				pDrone_makeDecision(1,1,ix);
				pDroneModeCounter[ix] = 0;
				break;
			case 1:
				pDrone_driveArcade(-10,0,20,2,ix);
				break;
			case 2:
				pDrone_driveArcade(0,9,10,3,ix);
				break;
			case 3:
				pDrone_driveArcade(10,0,5,4,ix);
				break;
			case 4:
				pDrone_driveArcade(0,9,10,5,ix);
				break;
			case 5:
				throwCube_partner(ix);
				tp_state[ix] = 6;
			case 6:
				if (pDroneModeCounter[ix] > 3) pDrone_driveArcade(-20,0,4,7,ix); 
				else if (pDroneModeCounter[ix] > 0) pDrone_driveArcade(-15,0,4,7,ix); 
				else pDrone_driveArcade(-10,0,4,7,ix);
				break;
			case 7:
				pDrone_driveArcade(0,-10,13,8,ix);
				break;
			case 8:
				if (pDroneModeCounter[ix] > 2) pDrone_driveArcade(12,0,3,9,ix);
				else pDrone_driveArcade(9,0,3,9,ix);
				break;
			case 9:
				grabCube_partner(ix);
				tp_state[ix] = 10;
			case 10:
				if (pDroneModeCounter[ix] > 2) pDrone_driveArcade(-12,0,3,11,ix);
				else  pDrone_driveArcade(-9,0,3,11,ix);
				break;
			case 11:
				pDrone_driveArcade(0,10,13,12,ix);
				break;
			case 12:
				pDrone_driveArcade(20,0,4,13,ix);			// drive forward more than necessary
				break;
			case 13:
				throwCube_partner(ix);
				if (++pDroneModeCounter[ix] > 7) tp_state[ix] = 14; else tp_state[ix] = 6;
			default:
				break;
		}
	}

	function teleopPeriodic(ix){

		switch(pDroneMode[ix]){
			case 0:
//				if (ix == 1) pDrone_makeDecision(1,101,ix); else pDrone_makeDecision(101,1,ix);
				break;
			case 1:
//				pDrone_driveArcade(10, 0, 10, 2, ix);
				break;
			case 2:
				tp_Mode_2(ix)
				break;

			case 101:
//				pDrone_driveArcade(10, 0, 10, 102, ix);
				break;
			case 102:
//				pDrone_driveArcade(0, 10, 9, 103, ix);
				break;
			default:
				break;
		}
		tp_counter[ix]++;
	}

