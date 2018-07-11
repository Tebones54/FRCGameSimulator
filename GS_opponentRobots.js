	var OposeX = [700,700,700];
	var OposeY = [150,100,50];
	var OposeR = [3.14,3.14,3.14];
	var OposeZ = [0,0,0];
	
	var OrobotW = [23,23,23];
	var OrobotL = [28,28,28];
	var OrobotH = [46,46,46];

	var OgrbZoneX = [13,13,13];			// relative to 0,0 center of robot
	var OgrbZoneY = [-8,-8,-8];
	var OgrbZoneW = [15,15,15];
	var OgrbZoneH = [15,15,15];
	
	var OhasCube = [true,true,true];
	var OtheCube = [35,36,37];			// initial cube and subsequent ones	

	var OdroneMode = [0,2,0];					// 0 = do nothing, 1..n = strategies
	var OdroneModeCounter = [0,0,0];
	
	function initRobot_opponents(){
		OhasCube = [true,true,true];
		OtheCube = [35,36,37];
		OposeZ = [0,0,0];
	}

	function drawRobot_opponent(ix){
		if (redalliance.checked) ctx.strokeStyle = "blue"; else ctx.strokeStyle = "red";
		ctx.lineWidth = 9;
		if (ix == 0) ctx.fillStyle = "pink"; else ctx.fillStyle = "#666";
		ctx.translate(OposeX[ix],OposeY[ix]);
		ctx.rotate(OposeR[ix]);
		ctx.strokeRect(-(OrobotW[ix]/2), -(OrobotL[ix]/2),OrobotW[ix],OrobotL[ix]);
		ctx.fillRect(-(OrobotW[ix]/2), -(OrobotL[ix]/2),OrobotW[ix],OrobotL[ix]);
		
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "white";
		ctx.moveTo(0,0);
		ctx.lineTo(10,0);
		ctx.stroke();

		if (OhasCube[ix]){
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
			ctx.strokeRect(OgrbZoneX[ix],OgrbZoneY[ix],OgrbZoneW[ix],OgrbZoneH[ix]);
		}
		ctx.strokeStyle = "white";
		if (ix == 1) ctx.strokeText( "1",-10,-5);
		else if (ix == 2) ctx.strokeText( "2",-10,-5);
		
		if ((ix == 0)&&(OposeZ[0] > 0)) {
			ctx.strokeStyle = "black";
//			ctx.fillStyle = "white";
			ctx.strokeText( OposeZ[0], -10,-5);
//			ctx.strokeText( "12", -10,-5);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	function clearRobot_opponent(ix){
		ctx.translate(OposeX[ix],OposeY[ix]);
		ctx.rotate(OposeR[ix]);
		ctx.clearRect(-(OrobotW[ix]/2)-6, -(OrobotL[ix]/2)-6,OrobotW[ix]+12,OrobotL[ix]+12);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	
	function moveX_opponent(x,ix){
		clearRobot_opponent(ix);
		OposeX[ix] += x*(Math.cos(OposeR[ix]) );
		OposeY[ix] += x*(Math.sin(OposeR[ix]) );
		drawRobot_opponent(ix);
	}
	function moveY_opponent(y,ix){
		clearRobot_opponent(ix);
		OposeX[ix] += y*(Math.sin(-OposeR[ix]) );
		OposeY[ix] += y*(Math.cos(OposeR[ix]) );
		drawRobot_opponent(ix);
	}
	function rotate_opponent(r,ix){
		clearRobot_opponent(ix);
		OposeR[ix] += r*(Math.PI/180);
		drawRobot_opponent(ix);
	}
	function moveSR_opponent(speed,rotate,ix){
		var prevX = OposeX[ix];
		var prevY = OposeY[ix];

		if (OposeZ[ix] == 0){		
			clearRobot_opponent(ix);
			OposeX[ix] += speed*(Math.cos(OposeR[ix]));
			OposeY[ix] += speed*(Math.sin(OposeR[ix]));
			if (OposeX[ix] < CX1) OposeX[ix] = CX1;
			else if (OposeX[ix] > CX2) OposeX[ix] = CX2;
			if (OposeY[ix] < CY1) OposeY[ix] = CY1;
			else if (OposeY[ix] > CY2) OposeY[ix] = CY2;
			
			if ( (OposeX[ix] > (SWR_Fence_X-(robotW/2)))&&(OposeX[ix] < (SWR_Fence_X2+(robotW/2)))&&(OposeY[ix] > (SWR_Fence_Y-(robotL/2)))&&(OposeY[ix] < (SWR_Fence_Y2+(robotL/2))))
			{
				OposeX[ix] = prevX;
				OposeY[ix] = prevY;
			}
			else if ( (OposeX[ix] > (SWB_Fence_X-(robotW/2)))&&(OposeX[ix] < (SWB_Fence_X2+(robotW/2)))&&(OposeY[ix] > (SWB_Fence_Y-(robotL/2)))&&(OposeY[ix] < (SWB_Fence_Y2+(robotL/2))))
			{
				OposeX[ix] = prevX;
				OposeY[ix] = prevY;
			}
			else if ( (OposeX[ix] > SCA_Base_X)&&(OposeX[ix] < SCA_Base_X2)&&(OposeY[ix] > SCA_Base_Y)&&(OposeY[ix] < SCA_Base_Y2) )
			{
				OposeX[ix] = prevX;
				OposeY[ix] = prevY;
			}
			
			OposeR[ix] += rotate*(Math.PI/180);
			drawRobot_opponent(ix);
		}
	}
	
	function pukeCube_opponent(ix){
		cubeX[OtheCube[ix]] = OposeX[ix]+(20*Math.cos(OposeR[ix]));
		cubeY[OtheCube[ix]] = OposeY[ix]+(20*Math.sin(OposeR[ix]));
		// check to see if scored or on field
		cube[OtheCube[ix]] = 2;
		OhasCube[ix] = false;
		FRC_checkForScore(OtheCube[ix]);
		FRC_checkForExchange(OtheCube[ix]);
	}
	function throwCube_opponent(ix){
		cubeX[OtheCube[ix]] = OposeX[ix]+(40*Math.cos(OposeR[ix]));
		cubeY[OtheCube[ix]] = OposeY[ix]+(40*Math.sin(OposeR[ix]));
		// check to see if scored or on field
		cube[OtheCube[ix]] = 2;
		OhasCube[ix] = false;
		FRC_checkForScore(OtheCube[ix]);
		FRC_checkForExchange(OtheCube[ix]);
	}
	function grabCube_opponent(ix){
		var X;
		var Y;

		for (i=0; i< maxCubes; i++){
			if (cube[i] == 2){
				
				newPoseX = OposeX[ix] + 17 * Math.cos(OposeR[ix]);
				newPoseY = OposeY[ix] + 17 * Math.sin(OposeR[ix]);
				X = cubeX[i]-newPoseX;
				Y = cubeY[i]-newPoseY;
	
				dist = Math.sqrt((X*X)+(Y*Y));
				if (dist < 10){
					OtheCube[ix] = i;
					cube[OtheCube[ix]] = 1;
					OhasCube[ix] = true;
					break;
				}
			}
		}
	}
	function climb_opponent(ix){
		if (PointInRect(OposeX[ix],OposeY[ix],RED_Platform_CX+5,RED_Platform_CY+20,Platform_CW,Platform_CH-20)) OposeZ[ix] += 1;
		else if (PointInRect(OposeX[ix],OposeY[ix],BLU_Platform_CX+5,BLU_Platform_CY+20,Platform_CW,Platform_CH-20)) OposeZ[ix] += 1;
		if (OposeZ[ix] < 0) OposeZ[ix] = 0;
		else if (OposeZ[ix] > 40) OposeZ[ix] = 40;			// max height of wheels above platform
	}

	function Drive_Arcade_opponent(speed,rotate,ix){
		moveSR_opponent(speed,rotate,ix);
	}

/*   *******************   Drone Partners   ***************************  */

	var tp2_state = [];
	tp2_state[0] = 0;
	tp2_state[1] = 0;
	tp2_state[2] = 0;
	var tp2_counter = [];
	tp2_counter[0] = 0;
	tp2_counter[1] = 0;
	tp2_counter[2] = 0;

	function oDrone_makeDecision(left,right,ix){
		if (HW2_MySwitchIsLeft() ) tp2_state[ix] = left; else tp2_state[ix] = right;
		tp2_counter[ix] = 0;
	}
	function oDrone_driveArcade( spd, rot, cyc, next, ix ){
		if (tp2_counter[ix] <= cyc){
			Drive_Arcade_opponent(spd,rot,ix);				
		}else{
			tp2_state[ix] = next;
			tp2_counter[ix] = 0;
		}
	}

/*    Interesting Effect  !!!!! Don't delete
	function oDrone_lineFollow( spd, destX, destY, timeout, next, ix ){
		var dist = Math.sqrt( ((OposeX[ix]-destX)*(OposeX[ix]-destX))+((OposeY[ix]-destY)*(OposeY[ix]-destY)));		
		var	heading = Math.atan( (destY-OposeY[ix])/(destX-OposeX[ix]) );
//		var errA = heading - OposeR[ix];		// angle error
		var errA;		// angle error

		errA = (destX < OposeX[ix])?(heading - OposeR[ix]):(OposeR[ix]-heading);
		
		if (tp2_counter[ix] <= timeout){
			Drive_Arcade_opponent(dist*0.1,errA*0.5,ix);				
		}else{
			tp2_state[ix] = next;
			tp2_counter[ix] = 0;
		}
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.moveTo(OposeX[ix],OposeY[ix]);
		ctx.lineTo(destX,destY);
		ctx.stroke();
		
		ctx.translate(OposeX[ix],OposeY[ix]);
		ctx.rotate(OposeR[ix]);
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "red";
//		ctx.moveTo(OposeX[ix],OposeY[ix]);
		ctx.moveTo(0,0);
//		ctx.lineTo(Math.cos(OposeR[ix])*20,Math.sin(OposeR[ix])*20);
		ctx.lineTo(Math.cos(heading)*40,Math.sin(heading)*40);
		ctx.stroke();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
*/

	function oDrone_lineFollow( spd, destX, destY, timeout, next, ix ){
		var dist = Math.sqrt( ((OposeX[ix]-destX)*(OposeX[ix]-destX))+((OposeY[ix]-destY)*(OposeY[ix]-destY)));		
		var	heading = Math.atan( (destY-OposeY[ix])/(destX-OposeX[ix]) );
//		var errA = heading - OposeR[ix];		// angle error
		var errA;		// angle error

		errA = (destX < OposeX[ix])?(heading - OposeR[ix]):(OposeR[ix]-heading);
		
		if (tp2_counter[ix] <= timeout){
//			Drive_Arcade_opponent(dist*0.1,errA*0.5,ix);				
			Drive_Arcade_opponent(dist*0.1,errA,ix);
			Drive_Arcade_opponent(dist*0.1,heading,ix);
		}else{
			tp2_state[ix] = next;
			tp2_counter[ix] = 0;
		}
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.moveTo(OposeX[ix],OposeY[ix]);
		ctx.lineTo(destX,destY);
		ctx.stroke();
		
		ctx.translate(OposeX[ix],OposeY[ix]);
		ctx.rotate(OposeR[ix]);
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "red";
//		ctx.moveTo(OposeX[ix],OposeY[ix]);
		ctx.moveTo(0,0);
//		ctx.lineTo(Math.cos(OposeR[ix])*20,Math.sin(OposeR[ix])*20);
		ctx.lineTo(Math.cos(heading)*40,Math.sin(heading)*40);
		ctx.stroke();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		diag1.innerHTML = "dist: "+dist.toFixed(2)+" Heading: "+heading.toFixed(2);
	}

	function initTeleop2(){
		tp2_state[0] = 0;
		tp2_state[1] = 0;
		tp2_counter[0] = 0;
		tp2_counter[1] = 0;
	}
	
	function tp2_Mode_1(ix){
		switch(tp2_state[ix]){
			case 0:
				if (ix == 1) oDrone_makeDecision(1,101,ix); else oDrone_makeDecision(101,1,ix);
				break;
			case 1:
//				oDrone_driveArcade(10, -2, 10, 2, ix);
				oDrone_lineFollow(10,560,256,100,2,ix);
				break;
			case 2:
				oDrone_driveArcade(0, -10, 9, 3, ix);
				break;
			case 3:
				throwCube_opponent(ix);
				tp2_state[ix] = 4;
			case 4:
				break;
				
			case 101:
//				oDrone_driveArcade(10, 0, 10, 102, ix);
				oDrone_lineFollow(10,560,256,100,2,ix);
				break;
			case 102:
				oDrone_driveArcade(0, 10, 9, 103, ix);
				break;
			case 103:
				throwCube_opponent(ix);
				tp2_state[ix] = 104;
			case 104:
				break;
			default:
				break;
		}		
	}
	function tp2_Mode_2(ix){
		switch(tp2_state[ix]){
			case 0:
				oDrone_makeDecision(1,1,ix);
				OdroneModeCounter[ix] = 0;
				break;
			case 1:
				oDrone_driveArcade(-10,0,20,2,ix);
				break;
			case 2:
				oDrone_driveArcade(0,9,10,3,ix);
				break;
			case 3:
				oDrone_driveArcade(10,0,5,4,ix);
				break;
			case 4:
				oDrone_driveArcade(0,9,10,5,ix);
				break;
			case 5:
				throwCube_opponent(ix);
				tp2_state[ix] = 6;
			case 6:
				if (OdroneModeCounter[ix] > 3) oDrone_driveArcade(-20,0,4,7,ix); 
				else if (OdroneModeCounter[ix] > 0) oDrone_driveArcade(-15,0,4,7,ix); 
				else oDrone_driveArcade(-10,0,4,7,ix);
				break;
			case 7:
				oDrone_driveArcade(0,-10,13,8,ix);
				break;
			case 8:
				if (OdroneModeCounter[ix] > 2) oDrone_driveArcade(12,0,3,9,ix);
				else oDrone_driveArcade(9,0,3,9,ix);
				break;
			case 9:
				grabCube_opponent(ix);
				tp2_state[ix] = 10;
			case 10:
				if (OdroneModeCounter[ix] > 2) oDrone_driveArcade(-12,0,3,11,ix);
				else  oDrone_driveArcade(-9,0,3,11,ix);
				break;
			case 11:
				oDrone_driveArcade(0,10,13,12,ix);
				break;
			case 12:
				oDrone_driveArcade(20,0,4,13,ix);			// drive forward more than necessary
				break;
			case 13:
				throwCube_opponent(ix);
				if (++OdroneModeCounter[ix] > 7) tp2_state[ix] = 14; else tp2_state[ix] = 6;
			default:
				break;
		}
	}

	function teleopPeriodic2(ix){
		switch (OdroneMode[ix]){
			case 0:
				
				break;
			case 1:
				tp2_Mode_1(ix);
				break;
			case 2:
				tp2_Mode_2(ix);
				break;
			default:
				break;
		}
		tp2_counter[ix]++;
	}
