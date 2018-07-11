/* ----------------------------    Field     ------------------------------*/
	var enabled = false;

	var RedRank = 0;
	var BlueRank = 0;
	var BlueScore = 0;
	var RedScore = 0;
	var PtsSwRed = 0;
	var PtsSwBlue = 0;
	var TimeSwRed = 0;
	var TimeSwBlue = 0;
	var PtsSCRed = 0;
	var PtsSCBlue = 0;
	var TimeSCRed = 0;
	var TimeSCBlue = 0;
	var PtsAutoRed = 0;
	var PtsAutoBlue = 0;
	var PtsClimbBlue = 0;		// points for climb
	var PtsClimbRed = 0;

	var autonRed = 0;			// number of robots across auton line
	var autonBlue = 0;
	var climbRed = 0;			// number of robots climbed
	var climbBlue = 0;

	var redswitch = 0;		// 0 = red on left
	var blueswitch = 0;
	var scale = 0;

	var balanceSWR = 0;			// weights * moments
	var balanceSWB = 0;
	var balanceSC = 0;

	var ownerSWR = 0;			// ownership 0=none, 1=red, 2=blue
	var ownerSWB = 0;
	var ownerSC = 0;

	var FE_OP_X	= 0;
	var FE_OP_Y	= 0;
	var FE_OP_W	= 750;		// 1/10th of feet
	var FE_OP_H	= 303;		// 1/10th of feet
	var FE_IA_X	= 106;
	var FE_IA_Y	= 17;
//	var FE_IA_W	= 540;		// 1/10th of feet
//	var FE_IA_H	= 270;		// 1/10th of feet
	var FE_IA_X1 = 648;		// 1/10th of feet
	var FE_IA_Y1 = 289;		// 1/10th of feet

	var CX1 = FE_IA_X+((robotW+robotH)/2)/2;	// C-Space
	var CX2 = FE_IA_X1-((robotW+robotH)/2)/2;
	var CY1 = FE_IA_Y+((robotW+robotH)/2)/2;
	var CY2 = FE_IA_Y1-((robotW+robotH)/2)/2;

	var centerline = 153;
	var autoLineRed = 206;
	var autoLineBlue = 547;

	var SW_W = 32;
	var SW_H = 24;
	var SWR_Left_X = 229;
	var SWR_Left_Y = 95;
	var SWR_Right_X = 229;
	var SWR_Right_Y = 187;

	var SW_Fence_W = 43;
	var SW_Fence_H = 126;

	var SWR_Fence_X = 223;
	var SWR_Fence_Y = 90;
	var SWR_Fence_X2 = SWR_Fence_X+SW_Fence_W;
	var SWR_Fence_Y2 = SWR_Fence_Y+SW_Fence_H;

	var SC_W = 32;
	var SC_H = 24;
	var SCA_Left_X = 361;
	var SCA_Left_Y = 80;
	var SCA_Right_X = 361;
	var SCA_Right_Y = 201;

	var SCA_Base_X	= 359;
	var SCA_Base_Y = 109;
	var SCA_Base_X2 = 396;
	var SCA_Base_Y2 = 197;

	var SWB_Left_X = 493;
	var SWB_Left_Y = 95;
	var SWB_Right_X = 493;
	var SWB_Right_Y = 187;

	var SWB_Fence_X = 487;
	var SWB_Fence_Y = 90;
	var SWB_Fence_X2 = SWB_Fence_X+SW_Fence_W;
	var SWB_Fence_Y2 = SWB_Fence_Y+SW_Fence_H;

	var RED_Platform_CX = 342;
	var RED_Platform_CY = 119;
	var Platform_CW = 20;
	var Platform_CH = 60;
	var BLU_Platform_CX = 392;
	var BLU_Platform_CY = 119;

	var RED_ExchangeX = 76;
	var RED_ExchangeY = 103;
	var ExchangeW = 30;
	var ExchangeH = 40;
	var BLU_ExchangeX = 650;
	var BLU_ExchangeY = 164;

	var loc1 = document.getElementById("mouseloc1");
	var cvs = document.getElementById("fieldTopView");
	var ctx = cvs.getContext("2d");
	var mode = document.getElementById("mode");
	var rscore = document.getElementById('rscore');
	var bscore = document.getElementById('bscore');
	var clock = document.getElementById('clock');
	var redalliance = document.getElementById('redalliance');
	var colors = document.getElementById('colors');
	var colors2 = document.getElementById('colors2');

	var redswpts = document.getElementById('redswpts');
	var redswtime = document.getElementById('redswtime');
	var blueswpts = document.getElementById('blueswpts');
	var blueswtime = document.getElementById('blueswtime');
	var redscpts = document.getElementById('redscpts');
	var redsctime = document.getElementById('redsctime');
	var bluescpts = document.getElementById('bluescpts');
	var bluesctime = document.getElementById('bluesctime');
	var BLU_boost_K
	var RED_boost_K

	function secondInterval(){
		BLU_boost_K = Blu_Boost_PU == pus.active?2:1;
	  RED_boost_K = Red_Boost_PU == pus.active?2:1;

		if (isAuton) value = 2; else value = 1;

		if (balanceSC > 10 || Blu_Force_PU == pus.active) {
			if (scale > 0.5) {
				BlueScore += value * BLU_boost_K;
				PtsSCBlue += value * BLU_boost_K;
				TimeSCBlue++;
			}else{
				RedScore += value * RED_boost_K;
				PtsSCRed += value * RED_boost_K;
				TimeSCRed++;
			}
		}
		else if (balanceSC < -10 || Red_Force_PU == pus.active) {
			if (scale > 0.5) {
				RedScore += value * RED_boost_K;
				PtsSCRed += value * RED_boost_K;
				TimeSCRed++;
			}else{
				BlueScore += value * BLU_boost_K;
				PtsSCBlue += value * BLU_boost_K;
				TimeSCBlue++;
			}
		}

		if ( ((balanceSWR > 10)&&(redswitch <= 0.5))||((balanceSWR < -10)&&(redswitch > 0.5))|| (Red_Force_PU == pus.active)) {
			RedScore += value * RED_boost_K;
			PtsSwRed += value * RED_boost_K;
			TimeSwRed++;
		}
//		if (balanceSWR > 10) {
//			if (redswitch < 0.5) {
//				RedScore += value;
//			}
//		}
//		else if (balanceSWR < -10) {
//			if (redswitch > 0.5) {
//				RedScore += value;
//			}
//		}

		if ( ((balanceSWB > 10)&&(blueswitch > 0.5))||((balanceSWB < -10)&&(blueswitch < 0.5))||(Blu_Force_PU == pus.active) ) {
			BlueScore += value * BLU_boost_K;
			PtsSwBlue += value * BLU_boost_K;
			TimeSwBlue++;
		}
//		if (balanceSWB > 10) {
//			if (blueswitch > 0.5){
//				BlueScore += value;
//			}
//		else if (balanceSWB < -10) {
//			if (blueswitch < 0.5){
//				BlueScore += value;
//			}
//		}

		rscore.innerHTML = RedScore;
		bscore.innerHTML = BlueScore;
		redswpts.innerHTML = PtsSwRed;
		blueswpts.innerHTML = PtsSwBlue;
		redswtime.innerHTML = TimeSwRed+" Secs";
		blueswtime.innerHTML = TimeSwBlue+" Secs";
		redscpts.innerHTML = PtsSCRed;
		bluescpts.innerHTML = PtsSCBlue;
		redsctime.innerHTML = TimeSCRed+" Secs";
		bluesctime.innerHTML = TimeSCBlue+" Secs";
	}

	function fieldReset(){
		cycle = 0;

		balanceSWR = 0;			// init all variables
		balanceSWB = 0;
		balanceSC = 0;
		ownerSC = 0;
		ownerSWB = 0;
		ownerSWR = 0;
		BlueScore = 0;
		RedScore = 0;
		PtsSwRed = 0;
		PtsSwBlue = 0;
		TimeSwRed = 0;
		TimeSwBlue = 0;
		PtsSCRed = 0;
		PtsSCBlue = 0;
		TimeSCRed = 0;
		TimeSCBlue = 0;
		PtsClimbBlue = 0;		// points for climb
		PtsClimbRed = 0;
		autonRed = 0;			// number of robots across auton line
		autonBlue = 0;
		climbRed = 0;			// number of robots climbed
		climbBlue = 0;
		PtsAutoRed = 0;
		PtsAutoBlue = 0;

		initRobot();
//		initRobot_partners();
		initRobot_opponents();
		initCubes();
		clearRobot();
		setInitalAutonPose();
		matchClock = 0;
		clockcell.setAttribute("Style","background-color:black;color:white;");
		drawField();
		drawCubes();
		drawRobot();
		updateGameData();

		setInitalAutonPose_partners();
		// drawRobot_partner(0);
		// drawRobot_partner(1);
		setInitalAutonPose_opponents();
		drawRobot_opponent(0);
		// drawRobot_opponent(1);
		// drawRobot_opponent(2);

		clock.innerHTML = 0;
		bscore.innerHTML = 0;
		rscore.innerHTML = 0;
		redswpts.innerHTML = PtsSwRed;
		blueswpts.innerHTML = PtsSwBlue;
		redswtime.innerHTML = TimeSwRed+" Secs";
		blueswtime.innerHTML = TimeSwBlue+" Secs";
		redscpts.innerHTML = PtsSCRed;
		bluescpts.innerHTML = PtsSCBlue;
		redsctime.innerHTML = TimeSCRed+" Secs";
		bluesctime.innerHTML = TimeSCBlue+" Secs";
		document.getElementById('blueclimb').innerHTML = PtsClimbBlue;
		document.getElementById('redclimb').innerHTML = PtsClimbRed;
	}

	function autonEnable(){
		// theAuton = parseInt(document.getElementById("aselect1").value);
		// adelay = 10*(document.getElementById("adelay1").value);

		if (document.getElementById("rand").checked) {
			var rvalue = Math.random();
			if (rvalue <= 0.25) {
				redswitch = 0;
				scale = 0;
				blueswitch = 0;
			}
			else if (rvalue <= 0.50) {
				redswitch = 1;
				scale = 0;
				blueswitch = 1;
			}
			else if (rvalue <= 0.75) {
				redswitch = 0;
				scale = 1;
				blueswitch = 0;
			}
			else {
				redswitch = 1;
				scale = 1;
				blueswitch = 1;
			}


//			redswitch = Math.random();	// 0..1
//			blueswitch = Math.random();
//			scale = Math.random();
			updateGameData();
		}
		drawField();
//		mouseloc1.innerHTML = "RedSW "+redswitch+"BlueSW "+blueswitch+"Scale "+scale;
		autonInit();
	}

	function drawField(){
		ctx.clearRect(FE_OP_X,FE_OP_Y,FE_OP_W,FE_OP_H);
		drawFE_OuterPerimeter();
		drawFE_InnerArea();
		drawFE_Scale();
		drawFE_SwitchRed();
		drawFE_SwitchBlue();
		drawCubes();
	}

	function drawFE_OuterPerimeter(){

	}
	function drawFE_InnerArea(){

		ctx.strokeStyle = "red";
		ctx.strokeRect(SWR_Fence_X,SWR_Fence_Y,SW_Fence_W,SW_Fence_H);	// switch border

		ctx.strokeStyle = "blue";
		ctx.strokeRect(SWB_Fence_X,SWB_Fence_Y,SW_Fence_W,SW_Fence_H);	// switch border
	}

	function drawAnimation(cycle){
		switch (cycle&1){
			case 0:
				ctx.fillStyle = "red";
				ctx.fillRect(SCA_Right_X,SCA_Right_Y,SC_W,SC_H);
				ctx.fillStyle = "blue";
				ctx.fillRect(SWB_Right_X,SWB_Right_Y,SW_W,SW_H); // lower
				ctx.fillStyle = "red";
				ctx.fillRect(SWB_Left_X,SWB_Left_Y,SW_W,SW_H);	// upper
				ctx.fillStyle = "blue";
				ctx.fillRect(SCA_Left_X,SCA_Left_Y,SC_W,SC_H);
				ctx.fillStyle = "red";
				ctx.fillRect(SWR_Left_X,SWR_Left_Y,SW_W,SW_H);
				ctx.fillStyle = "blue";
				ctx.fillRect(SWR_Right_X,SWR_Right_Y,SW_W,SW_H);
				break;
			case 1:
				ctx.fillStyle = "blue";
				ctx.fillRect(SCA_Right_X,SCA_Right_Y,SC_W,SC_H);
				ctx.fillStyle = "red";
				ctx.fillRect(SWB_Right_X,SWB_Right_Y,SW_W,SW_H); // lower
				ctx.fillStyle = "blue";
				ctx.fillRect(SWB_Left_X,SWB_Left_Y,SW_W,SW_H);	// upper
				ctx.fillStyle = "red";
				ctx.fillRect(SCA_Left_X,SCA_Left_Y,SC_W,SC_H);
				ctx.fillStyle = "blue";
				ctx.fillRect(SWR_Left_X,SWR_Left_Y,SW_W,SW_H);
				ctx.fillStyle = "red";
				ctx.fillRect(SWR_Right_X,SWR_Right_Y,SW_W,SW_H);
				break;
		}
	}
	function drawFE_Scale(){
		ctx.clearRect(SCA_Left_X-1,SCA_Left_Y-1,SC_W+2,SC_H+2);
		ctx.strokeStyle = "black";

		if (balanceSC > 10) ctx.fillStyle = (scale > 0.5)?"blue":"red";
		else if (balanceSC < -10) ctx.fillStyle = (scale > 0.5)?"red":"blue";
		else ctx.fillStyle = "white";

		ctx.beginPath();
		ctx.arc(SCA_Left_X+(SC_W/2), (balanceSC*0.1)+centerline, 5, 0, 2*Math.PI );
		ctx.fill();
		ctx.stroke();

		if (scale > 0.5) ctx.fillStyle = "red"; else ctx.fillStyle = "blue";
		ctx.fillRect(SCA_Left_X,SCA_Left_Y,SC_W,SC_H);
		if (scale > 0.5) ctx.fillStyle = "blue"; else ctx.fillStyle = "red";
		ctx.fillRect(SCA_Right_X,SCA_Right_Y,SC_W,SC_H);
	}
	function drawFE_SwitchRed(){
		ctx.clearRect(SWR_Left_X-1,SWR_Left_Y-1,SW_W+2,SW_H+2);
		ctx.strokeStyle = "black";

		if (balanceSWR > 10) ctx.fillStyle = (redswitch > 0.5)?"blue":"red";
		else if (balanceSWR < -10) ctx.fillStyle = (redswitch > 0.5)?"red":"blue";
		else ctx.fillStyle = "white";

		ctx.beginPath();
		ctx.arc(SWR_Left_X+(SW_W/2), (balanceSWR*0.1)+centerline, 5, 0, 2*Math.PI );
		ctx.fill();
		ctx.stroke();

		if (redswitch > 0.5) ctx.fillStyle = "red"; else ctx.fillStyle = "blue";
		ctx.fillRect(SWR_Left_X,SWR_Left_Y,SW_W,SW_H);
		if (redswitch > 0.5) ctx.fillStyle = "blue"; else ctx.fillStyle = "red";
		ctx.fillRect(SWR_Right_X,SWR_Right_Y,SW_W,SW_H);
	}
	function drawFE_SwitchBlue(){
		ctx.clearRect(SWB_Left_X-1,SWB_Left_Y-1,SW_W+2,SW_H+2);
		ctx.strokeStyle = "black";

		if (balanceSWB > 10) ctx.fillStyle = (blueswitch > 0.5)?"blue":"red";
		else if (balanceSWB < -10) ctx.fillStyle = (blueswitch > 0.5)?"red":"blue";
		else ctx.fillStyle = "white";

		ctx.beginPath();
		ctx.arc(SWB_Left_X+(SW_W/2), (balanceSWB*0.1)+centerline, 5, 0, 2*Math.PI );
		ctx.fill();
		ctx.stroke();

		if (blueswitch > 0.5) ctx.fillStyle = "red"; else ctx.fillStyle = "blue";
		ctx.fillRect(SWB_Left_X,SWB_Left_Y,SW_W,SW_H);	// upper
		if (blueswitch > 0.5) ctx.fillStyle = "blue"; else ctx.fillStyle = "red";
		ctx.fillRect(SWB_Right_X,SWB_Right_Y,SW_W,SW_H); // lower
	}

	function FRC_checkForScore(ix){
		if (isAuton) value = 2; else value = 1;		// 2pt auton, 1pt Teleop
		// SCALE  left side ( upper )
		if ( PointInRect(cubeX[ix],cubeY[ix],SCA_Left_X,SCA_Left_Y,SW_W,SW_H) ){
			balanceSC += (cubeY[ix]-centerline);

			if ((scale <= 0.5)&&(balanceSC < -10)){			// check for change of owner
				if (ownerSC != 2) {
					BlueScore += value;
					bscore.innerHTML = BlueScore;
					ownerSC = 2;
				}
			}else if ((scale > 0.5)&&(balanceSC < -10)){	// check for change of owner
				if (ownerSC != 1) {
					RedScore += value;
					rscore.innerHTML = RedScore;
					ownerSC = 1;
				}
			}
			cube[ix] = 3;
		}
		// right side ( lower )
		else if ( PointInRect(cubeX[ix],cubeY[ix],SCA_Right_X,SCA_Right_Y,SW_W,SW_H) ){
			balanceSC += (cubeY[ix]-centerline);

			if ((scale > 0.5)&&(balanceSC > 10)){
				if (ownerSC != 2) {
					BlueScore += value;
					bscore.innerHTML = BlueScore;
					ownerSC = 2;
				}
			}else if ((scale <= 0.5)&&(balanceSC > 10)){
				if (ownerSC != 1) {
					RedScore += value;
					rscore.innerHTML = RedScore;
					ownerSC = 1;
				}
			}
			cube[ix] = 3;
		}


		// BLUE ALLIANCE SWITCH  left side ( upper )
		else if ( PointInRect(cubeX[ix],cubeY[ix],SWB_Left_X,SWB_Left_Y,SW_W,SW_H) ){
			balanceSWB += (cubeY[ix]-centerline);
			if (blueswitch <= 0.5){
				BlueScore += value;
				bscore.innerHTML = BlueScore;
				cube[ix] = 3;
			}else{
				RedScore += value;
				rscore.innerHTML = RedScore;
				cube[ix] = 3;
			}
		}
		// right side ( lower )
		else if ( PointInRect(cubeX[ix],cubeY[ix],SWB_Right_X,SWB_Right_Y,SW_W,SW_H) ){
			balanceSWB += (cubeY[ix]-centerline);
			if (blueswitch > 0.5){
				BlueScore += value;
				bscore.innerHTML = BlueScore;
				cube[ix] = 3;
			}else{
				RedScore += value;
				rscore.innerHTML = RedScore;
				cube[ix] = 3;
			}
		}

		// RED ALLIANCE SWITCH
		else if ( PointInRect(cubeX[ix],cubeY[ix],SWR_Left_X,SWR_Left_Y,SW_W,SW_H) ){
			balanceSWR += (cubeY[ix]-centerline);
			if (redswitch <= 0.5){
				BlueScore += value;
				bscore.innerHTML = BlueScore;
				cube[ix] = 3;
			}else{
				RedScore += value;
				rscore.innerHTML = RedScore;
				cube[ix] = 3;
			}
		}
		// right side ( lower )
		else if ( PointInRect(cubeX[ix],cubeY[ix],SWR_Right_X,SWR_Right_Y,SW_W,SW_H) ){
			balanceSWR += (cubeY[ix]-centerline);
			if (redswitch > 0.5){
				BlueScore += value;
				bscore.innerHTML = BlueScore;
				cube[ix] = 3;
			}else{
				RedScore += value;
				rscore.innerHTML = RedScore;
				cube[ix] = 3;
			}
		}
	}
	function FRC_checkForExchange(ix){
		if ( PointInRect(cubeX[ix],cubeY[ix],RED_ExchangeX,RED_ExchangeY,ExchangeW,ExchangeH) ){
			addToReserve( "red", ix );
		}
		else if ( PointInRect(cubeX[ix],cubeY[ix],BLU_ExchangeX,BLU_ExchangeY,ExchangeW,ExchangeH) ){
			addToReserve( "blue", ix );
		}
	}

// 	function checkForClimbs(){
// 		var redr = [0,0,0];
// 		var blur = [0,0,0];
// 		// check drones
// 		// check power ups
// 		if (redalliance.checked) {
// 		// check primary robots
// 			if (PointInRect(poseX,poseY,RED_Platform_CX,RED_Platform_CY,Platform_CW,Platform_CH)){
// 				PtsClimbRed = 5;			// parking = 5
// 				if (poseZ > 12) PtsClimbRed += 25;
// 				RedScore += PtsClimbRed;
// 			}
// 			if (PointInRect(OposeX[0],OposeY[0],BLU_Platform_CX,BLU_Platform_CY,Platform_CW,Platform_CH)){
// 				PtsClimbBlue = 5;
// 				if (OposeZ[0] > 12) PtsClimbBlue += 25;
// 				BlueScore += PtsClimbBlue;
// 			}
// 		}else{
// 		// check primary robots
// 			if (PointInRect(poseX,poseY,BLU_Platform_CX,BLU_Platform_CY,Platform_CW,Platform_CH)){
// 				PtsClimbBlue = 5;
// 				if (poseZ > 12) PtsClimbBlue += 25;
// 				BlueScore += PtsClimbBlue;
// 			}
// 			if (PointInRect(OposeX[0],OposeY[0],RED_Platform_CX,RED_Platform_CY,Platform_CW,Platform_CH)){
// 				PtsClimbRed = 5;
// 				if (OposeZ[0] > 12) PtsClimbRed += 25;
// 				RedScore += PtsClimbRed;
// 			}
// 		}
// 		if (Red_Levitate_PU) {
// 			PtsClimbRed += 30;
// 			if (PtsClimbRed > 90) PtsClimbRed = 90;
// 		}
// 		if (Blu_Levitate_PU)  {
// 			PtsClimbBlue += 30;
// 			if (PtsClimbBlue > 90) PtsClimbBlue = 90;
// 		}
//
// 		document.getElementById('blueclimb').innerHTML = PtsClimbBlue;
// 		document.getElementById('redclimb').innerHTML = PtsClimbRed;
// 		rscore.innerHTML = RedScore;
// 		bscore.innerHTML = BlueScore;
// 		// if all 3 on an alliance climbed, RP += 1
// 	}


	function CFC_Red(x,y,z){		// return points
		var points = 0;
		if (PointInRect(x,y,RED_Platform_CX,RED_Platform_CY,Platform_CW,Platform_CH)){
			points = 5;			// parking = 5
			if (z > 12) points += 25;
		}else{
			points = 0;
		}
		return points;
	}
	function CFC_Blue(x,y,z){
		var points = 0;
		if (PointInRect(x,y,BLU_Platform_CX,BLU_Platform_CY,Platform_CW,Platform_CH)){
			points = 5;			// parking = 5
			if (z > 12) points += 25;
		}else{
			points = 0;
		}
		return points;
	}

	function checkForClimbs(){
		var redr = [0,0,0];
		var blur = [0,0,0];
		var usedRed = false;
		var usedBlue = false;
		// check drones
		if (redalliance.checked) {
		// check primary robots
			redr[0] = CFC_Red(poseX,poseY,poseZ);
			redr[1] = CFC_Red(PposeX[0],PposeY[0],PposeZ[0]);
			redr[2] = CFC_Red(PposeX[1],PposeY[1],PposeZ[1]);
			blur[0] = CFC_Blue(OposeX[0],OposeY[0],OposeZ[0]);
			blur[1] = CFC_Blue(OposeX[1],OposeY[1],OposeZ[1]);
			blur[2] = CFC_Blue(OposeX[2],OposeY[2],OposeZ[2]);
		}else{
		// check primary robots
			redr[0] = CFC_Red(OposeX[0],OposeY[0],OposeZ[0]);
			redr[1] = CFC_Red(OposeX[1],OposeY[1],OposeZ[1]);
			redr[2] = CFC_Red(OposeX[2],OposeY[2],OposeZ[2]);
			blur[0] = CFC_Blue(poseX,poseY,poseZ);
			blur[1] = CFC_Blue(PposeX[0],PposeY[0],PposeZ[0]);
			blur[2] = CFC_Blue(PposeX[1],PposeY[1],PposeZ[1]);
		}

		if (Red_Levitate_PU) {
			if (redr[0] < 30) redr[0] = 30;
			else if (redr[1] < 30) redr[1] = 30;
			else if (redr[2] < 30) redr[2] = 30;
		}
		if (Blu_Levitate_PU)  {
			if (blur[0] < 30) blur[0] = 30;
			else if (blur[1] < 30) blur[1] = 30;
			else if (blur[2] < 30) blur[2] = 30;
		}

		PtsClimbRed = redr[0]+redr[1]+redr[2];
		PtsClimbBlue = blur[0]+blur[1]+blur[2];

		document.getElementById('redclimbdetail').innerHTML = redr[0] + "-" + redr[1] + "-" + redr[2];
		document.getElementById('blueclimbdetail').innerHTML = blur[0] + "-" + blur[1] + "-" + blur[2];
		document.getElementById('blueclimb').innerHTML = PtsClimbBlue;
		document.getElementById('redclimb').innerHTML = PtsClimbRed;

		RedScore += PtsClimbRed;
		BlueScore += PtsClimbBlue;

		rscore.innerHTML = RedScore;
		bscore.innerHTML = BlueScore;
		// if all 3 on an alliance climbed, RP += 1
	}
	function checkForAutons(){
		PtsAutoRed = 0;
		PtsAutoBlue = 0;
		if (redalliance.checked){
			if (poseX > autoLineRed) PtsAutoRed += 5;
			if (PposeX[0] > autoLineRed) PtsAutoRed += 5;
			if (PposeX[1] > autoLineRed) PtsAutoRed += 5;
			if (OposeX[0] < autoLineBlue) PtsAutoBlue += 5;
			if (OposeX[1] < autoLineBlue) PtsAutoBlue += 5;
			if (OposeX[2] < autoLineBlue) PtsAutoBlue += 5;
		}else{
			if (poseX < autoLineBlue) PtsAutoBlue += 5;
			if (PposeX[0] < autoLineBlue) PtsAutoBlue += 5;
			if (PposeX[1] < autoLineBlue) PtsAutoBlue += 5;
			if (OposeX[0] > autoLineRed) PtsAutoRed += 5;
			if (OposeX[1] > autoLineRed) PtsAutoRed += 5;
			if (OposeX[2] > autoLineRed) PtsAutoRed += 5;
		}
		if ((PtsAutoRed == 15)&&(PtsSwRed > 0)) RedRank = 1;
		if ((PtsAutoBlue == 15)&&(PtsSwBlue > 0)) BlueRank = 1;

		RedScore += PtsAutoRed;
		BlueScore += PtsAutoBlue;

		document.getElementById('blueauton').innerHTML = PtsAutoBlue;
		document.getElementById('redauton').innerHTML = PtsAutoRed;
		document.getElementById('blueautonrank').innerHTML = (PtsAutoBlue==5)?"5-0-0":((PtsAutoBlue==10)?"5-5-0":((PtsAutoBlue==15)?"5-5-5":"0-0-0"));
		document.getElementById('redautonrank').innerHTML = (PtsAutoRed==5)?"5-0-0":((PtsAutoRed==10)?"5-5-0":((PtsAutoRed==15)?"5-5-5":"0-0-0"));
		document.getElementById('rrank').innerHTML = RedRank;
		document.getElementById('brank').innerHTML = BlueRank;
		rscore.innerHTML = RedScore;
		bscore.innerHTML = BlueScore;
	}
	function updateRP(){
		if (PtsClimbRed == 90) RedRank += 1;
		if (PtsClimbBlue == 90) BlueRank += 1;

		if (RedScore > BlueScore) {
			RedRank += 2;
		}
		else if (RedScore < BlueScore){
			BlueRank += 2;
		}
		else {
			RedRank += 1;
			BlueRank += 1;
		}
		document.getElementById('rrank').innerHTML = RedRank;
		document.getElementById('brank').innerHTML = BlueRank;
	}

	function initField(){
		loadGameSetup();
	}


/* **************   Hardware Abstractions ****************** */

	function FRC_MySwitchIsLeft(){
		return ( colors.innerHTML.charAt(0) == "L" );
	}
	function FRC_TheScaleIsLeft(){
		return ( colors.innerHTML.charAt(1) == "L" );
	}
