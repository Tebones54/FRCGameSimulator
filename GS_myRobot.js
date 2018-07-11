	var poseX = 50;
	var poseY = 150;
	var poseR = 0;		// rotation
	var poseZ = 0;		// height above ground

	var robotW = 23;
	var robotL = 28;
	var robotH = 46;

	var grbZoneX = 13;			// relative to 0,0 centerof robot
	var grbZoneY = -8;
	var grbZoneW = 15;
	var grbZoneH = 15;

	var hasCube = true;
	var theCube = 32;			// initial cube and subsequent ones

/*  *********  Sensor Globals  ******** */

	var ENC_LeftTicks = 0;
	var ENC_LeftDistance = 0;
	var ENC_LeftVelocity = 0;
	var ENC_RightTicks = 0;
	var ENC_RightDistance = 0;
	var ENC_RightVelocity = 0;
	var GYRO_Degrees = 0;
	var GYRO_Rate = 0;

	function initRobot(){
		hasCube = true;
		theCube = 32;
		poseZ = 0;				// put back on ground
	}
	function drawRobot(){
		if (redalliance.checked) ctx.strokeStyle = "red"; else ctx.strokeStyle = "blue";
		ctx.lineWidth = 9;
		ctx.translate(poseX,poseY);
		ctx.rotate(poseR);
		ctx.strokeRect(-(robotW/2), -(robotL/2),robotW,robotL);
		ctx.fillStyle = "lime";
		ctx.fillRect(-(robotW/2), -(robotL/2),robotW,robotL);

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "white";
		ctx.moveTo(0,0);
		ctx.lineTo(10,0);
		ctx.stroke();

		if (hasCube){
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
			ctx.strokeRect(grbZoneX,grbZoneY,grbZoneW,grbZoneH);
		}
		if (poseZ > 0) {
			ctx.strokeStyle = "black";
//			ctx.fillStyle = "white";
			ctx.strokeText( poseZ, -10,-5);
//			ctx.strokeText( "12", -10,-5);
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	function clearRobot(){
		ctx.translate(poseX,poseY);
		ctx.rotate(poseR);
		ctx.clearRect(-(robotW/2)-6, -(robotL/2)-6,robotW+12,robotL+12);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

/* *******   Simple Grafic Movements that work within C-space  ********** */

	function moveX(x){
		clearRobot();
		poseX += x*(Math.cos(poseR) );
		poseY += x*(Math.sin(poseR) );
		drawRobot();
		if(puppet.checked) driveRobot(speed,rotate);
	}
	function moveY(y){
		clearRobot();
		poseX += y*(Math.sin(-poseR) );
		poseY += y*(Math.cos(poseR) );
		drawRobot();
		if(puppet.checked) driveRobot(speed,rotate);
	}
	function rotate(r){
		clearRobot();
		poseR += r*(Math.PI/180);
		drawRobot();
		if(puppet.checked) driveRobot(speed,rotate);
	}
	function moveSR(speed,rotate){
		var prevX = poseX;
		var prevY = poseY;

		if (poseZ == 0){
			clearRobot();
			poseX += speed*(Math.cos(poseR));
			poseY += speed*(Math.sin(poseR));
			if (poseX < CX1) poseX = CX1;
			else if (poseX > CX2) poseX = CX2;
			if (poseY < CY1) poseY = CY1;
			else if (poseY > CY2) poseY = CY2;

			// SWR_Fence_X,SWR_Fence_Y,SWR_Fence_X2,SWR_Fence_Y2

			if ( (poseX > (SWR_Fence_X-(robotW/2)))&&(poseX < (SWR_Fence_X2+(robotW/2)))&&(poseY > (SWR_Fence_Y-(robotL/2)))&&(poseY < (SWR_Fence_Y2+(robotL/2))))
			{
				poseX = prevX;
				poseY = prevY;
			}
			else if ( (poseX > (SWB_Fence_X-(robotW/2)))&&(poseX < (SWB_Fence_X2+(robotW/2)))&&(poseY > (SWB_Fence_Y-(robotL/2)))&&(poseY < (SWB_Fence_Y2+(robotL/2))))
			{
				poseX = prevX;
				poseY = prevY;
			}
			else if ( (poseX > SCA_Base_X)&&(poseX < SCA_Base_X2)&&(poseY > SCA_Base_Y)&&(poseY < SCA_Base_Y2) )
			{
				poseX = prevX;
				poseY = prevY;
			}

			poseR += rotate*(Math.PI/180);
			drawRobot();
			if(puppet.checked) driveRobot(speed,rotate);
		}
	}
	function poopCube(dist){
		cubeX[theCube] = poseX+(dist*Math.cos(poseR));
		cubeY[theCube] = poseY+(dist*Math.sin(poseR));
		cubeR[theCube] = poseR;
		// check to see if scored or on field
		cube[theCube] = cs.field;
		hasCube = false;
		FRC_checkForScore(theCube);
	}
	function pukeCube(){
		cubeX[theCube] = poseX+(20*Math.cos(poseR));
		cubeY[theCube] = poseY+(20*Math.sin(poseR));
		cubeR[theCube] = poseR;
		// check to see if scored or on field
		cube[theCube] = cs.field;
		hasCube = false;
		FRC_checkForScore(theCube);
		FRC_checkForExchange(theCube);
	}
	function throwCube(){
		cubeX[theCube] = poseX+(40*Math.cos(poseR));
		cubeY[theCube] = poseY+(40*Math.sin(poseR));
		cubeR[theCube] = poseR;

		// check to see if scored or on field
		cube[theCube] = cs.field;
		hasCube = false;
		FRC_checkForScore(theCube);
		FRC_checkForExchange(theCube);
	}
	function grabCube(){
		var X;
		var Y;
		var closest = 0;

//		mouseloc1.innerHTML="X: "+poseX+" Y: "+poseY+" R: "+poseR+" Dist: "+dist;
		mouseloc1.innerHTML="X: "+poseX+" Y: "+poseY+" R: "+poseR;

		for (i=0; i< maxCubes; i++){
			if (cube[i] == cs.field){

				newPoseX = poseX + 17 * Math.cos(poseR);
				newPoseY = poseY + 17 * Math.sin(poseR);
				X = cubeX[i]-newPoseX;
				Y = cubeY[i]-newPoseY;

//				X = cubeX[i]-poseX;
//				Y = cubeY[i]-poseY;
				dist = Math.sqrt((X*X)+(Y*Y));
//				if (dist < closest) dist = closest;

//				ctx.strokeRect(poseX+grbZoneX,poseY+grbZoneY,20*Math.cos(poseR),20*Math.sin(poseR) );
//				ctx.beginPath();
//				ctx.moveTo( poseX, poseY);
//	  			ctx.lineTo( poseX+(30*Math.cos(poseR+0.2)), poseY+(30*Math.sin(poseR+0.2)) );
//				ctx.stroke();
//				ctx.beginPath();
//				ctx.moveTo( poseX, poseY);
//	  			ctx.lineTo( poseX+(30*Math.cos(poseR-0.2)), poseY+(30*Math.sin(poseR-0.2)) );
//				ctx.stroke();


///				if ( (X > grbZoneX)&&(X < (grbZoneX+grbZoneW)) && (Y > grbZoneY)&&(Y < (grbZoneY+grbZoneH)) ){
				if (dist < 10){
					theCube = i;
					cube[theCube] = cs.robot;
					cubeR[theCube] = poseR;
					hasCube = true;
					break;
				}
			}
		}
	}
	function climb(){
		if (PointInRect(poseX,poseY,RED_Platform_CX+5,RED_Platform_CY+20,Platform_CW,Platform_CH-20)) poseZ += 1;
		else if (PointInRect(poseX,poseY,BLU_Platform_CX+5,BLU_Platform_CY+20,Platform_CW,Platform_CH-20)) poseZ += 1;
		if (poseZ < 0) poseZ = 0;
		else if (poseZ > 40) poseZ = 40;			// max height of wheels above platform
	}

/* *******  Translated Power to Movement based on actual robot characteristics  ******* */

	function Drive_Arcade(speed,rotate){
		moveSR(speed,rotate);
	}

	/* Empirical contants and derived values from actual robot */
	const kVelocity_MAX = 12;			// 12 ft per second ( measured )
	const kWheelDiameter = 4;			// duh
	const kEncoderTicksPerRev = 1024;
	const kWheelBase = 28;				// inches wide
	var calcRPS = (kVelocity_MAX*12)/(kWheelBase*Math.PI);		// RPS
	const kRotation_MAX = 300;			// 300 deg per second measured
	var calcRotScrub = (calcRPS*360)-kRotation_MAX;

	function Drive_Arcade2(speed,rotate){					// power settings in %vbus -1.0 to +1.0
		// translate power settings to pixel deltas
		// 1.0 = fastest speed forward, -1.0 fastest reverse in ft/s
		var PXspeed = speed*kVelocity_MAX;					// simple linear data ( not real )
		var PXrotate = (rotate*kRotation_MAX)*(Math.PI/180);

		moveSR(PXspeed,PXrotate);
	}
	function Drive_Cheesy(speed,rotate,strafe){
		clearRobot();
		poseX += speed*(Math.cos(poseR));
		poseY += speed*(Math.sin(poseR));
		if (poseX < CX1) poseX = CX1;
		else if (poseX > CX2) poseX = CX2;
		if (poseY < CY1) poseY = CY1;
		else if (poseY > CY2) poseY = CY2;
		poseR += rotate*(Math.PI/180);
		poseX += strafe*(Math.sin(-poseR));			// strafe
		poseY += strafe*(Math.cos(poseR));
		drawRobot();
	}

/*   *******************   Driving Puppet Robot   ***************************  */

var request = null;
request = new XMLHttpRequest();
var updateCount = 0;

var LeftMotorEnable = 0;
var LeftMotorPower = 0;
var RightMotorEnable = 0;
var RightMotorPower = 0;

function sendRequest( url) {
	pstat.innerHTML="--->";

	request.open("GET",url,true);
	request.onreadystatechange=updateInfo;
	request.setRequestHeader("If-Modified-Since", "Fri, 15 Feb 2013 13:43:19 GMT");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send(null);
	updateCount++;
}

function updateInfo(){
	if (request.readyState == 4) {
		if (request.status == 200) {
//			diag1.innerHTML=request.responseText;
//			document.getElementById("cycle").innerHTML= updateCount;
			statusLine = request.responseText.split("\n");
		}
		else if (request.status == 304) {
//			alert ("Error " + request.status);
		}
		else if (request.status == 404) {
//			alert ("Error " + request.status);
		}
		else {
//			document.getElementById("networkStatus").innerHTML="Error " + request.status;
//			alert ("Error " + request.status);
		}
	}
//	pstat.innerHTML=request.readyState + " / " + request.status;
}

function disableRobot(){
	RightMotorEnable = 0;
	LeftMotorEnable = 0;
	LeftMotorPower = 0;
	RightMotorPower = 0;
	url = domain+"getdualstatus.html?en0=0&pwr0=0&en1=0&pwr1=0";
	sendRequest(url);
	diag1.innerHTML = url;
}
function driveRobot(speed,rotate){
	RightMotorEnable = 1;
	LeftMotorEnable = 1;
	LeftMotorPower = (speed*10)+(rotate*1.5);
	RightMotorPower = (-speed*10)+(rotate*1.5);
	if (LeftMotorPower > 100) LeftMotorPower = 100;
	else if (LeftMotorPower < -100) LeftMotorPower = -100;
	if (RightMotorPower > 100) RightMotorPower = 100;
	else if (RightMotorPower < -100) RightMotorPower = -100;

	sendRequest(domain+"getdualstatus.html?en0="+LeftMotorEnable+"&pwr0="+LeftMotorPower.toFixed(0)+"&en1="+RightMotorEnable+"&pwr1="+RightMotorPower.toFixed(0));
}
