/* ----------------------------    Cubes     ------------------------------*/

	const cs = {"out":0, "robot":1,"field":2,"scored":3,"reserve":4,"levitate":5,"boost":6,"force":7 };

// there can be 9 cubes in reserve

	var cube = [];		// 0 = out of play, 1 = on robot, 2 = on field, 3 = scored
	var cubeX = [];
	var cubeY = [];
	var cubeR = [];
	var cubeZ = [];
	var maxCubes = 66;

	var ReserveRed = [0,0,0, 0,0,0, 0,0,0];		// array of cube indexs
	var ReserveBlu = [0,0,0, 0,0,0, 0,0,0];
	var RcountRed = 0;
	var RcountBlu = 0;

	var Red_Boost = 0;
	var Red_Levitate = 0;
	var Red_Force = 0;
	var Blu_Boost = 0;
	var Blu_Levitate = 0;
	var Blu_Force = 0;

	const pus = {"idle":0,"queued":1,"active":2,"done":3};

	var Red_Boost_PU = pus.idle;		// 1	// these should be enums
	var Red_Levitate_PU = pus.idle;		// 2
	var Red_Force_PU = pus.idle;		// 3
	var Blu_Boost_PU = pus.idle;		// 4
	var Blu_Levitate_PU = pus.idle;		// 5
	var Blu_Force_PU = pus.idle;		// 6

	var currentPU = 0;

	var rsrvXred = 60;
	var rsrvXblu = 695;
	var reserveY = [70,90,110,130,150,170,190,210,230];

	function addToReserve( which, theCube ){
		if (which == "red"){
			ReserveRed[RcountRed] = theCube;
			cubeX[theCube] = rsrvXred;
			cubeY[theCube] = reserveY[RcountRed];
			cube[theCube] = cs.reserve;
			RcountRed++
		}else{
			ReserveBlu[RcountBlu] = theCube;
			cubeX[theCube] = rsrvXblu;
			cubeY[theCube] = reserveY[RcountBlu];
			cube[theCube] = cs.reserve;
			RcountBlu++
		}
	}

	function initCubes(){
		RcountRed = 0;
		RcountBlu = 0;
		Red_Boost = 0;
		Red_Levitate = 0;
		Red_Force = 0;
		Blu_Boost = 0;
		Blu_Levitate = 0;
		Blu_Force = 0;
		Red_Boost_PU = pus.idle;
		Red_Levitate_PU =  pus.idle;
		Red_Force_PU =  pus.idle;
		Blu_Boost_PU =  pus.idle;
		Blu_Levitate_PU =  pus.idle;
		Blu_Force_PU =  pus.idle;
		currentPU = 0;

		cubeX[0]=193; cubeY[0]=152; cubeZ[0]=5;			// pyramid
		cubeX[1]=205; cubeY[1]=147; cubeZ[1]=5;
		cubeX[2]=205; cubeY[2]=157; cubeZ[2]=5;
		cubeX[3]=215; cubeY[3]=142; cubeZ[3]=5;
		cubeX[4]=215; cubeY[4]=152; cubeZ[4]=5;
		cubeX[5]=215; cubeY[5]=162; cubeZ[5]=5;

		cubeX[6]=205; cubeY[6]=152; cubeZ[6]=15;
		cubeX[7]=215; cubeY[7]=147; cubeZ[7]=15;
		cubeX[8]=215; cubeY[8]=158; cubeZ[8]=15;

		cubeX[9]=215; cubeY[9]=152; cubeZ[9]=25;

		cubeX[10]=274; cubeY[10]=94; cubeZ[10]=5;		// line
		cubeX[11]=274; cubeY[11]=cubeY[10]+24; cubeZ[11]=5;
		cubeX[12]=274; cubeY[12]=cubeY[11]+24; cubeZ[12]=5;
		cubeX[13]=274; cubeY[13]=cubeY[12]+24; cubeZ[13]=5;
		cubeX[14]=274; cubeY[14]=cubeY[13]+23; cubeZ[14]=5;
		cubeX[15]=274; cubeY[15]=cubeY[14]+23; cubeZ[15]=5;

		cubeX[16]=558; cubeY[16]=152; cubeZ[16]=5;		// pyramid
		cubeX[17]=547; cubeY[17]=147; cubeZ[17]=5;
		cubeX[18]=547; cubeY[18]=157; cubeZ[18]=5;
		cubeX[19]=536; cubeY[19]=142; cubeZ[19]=5;
		cubeX[20]=536; cubeY[20]=152; cubeZ[20]=5;
		cubeX[21]=536; cubeY[21]=162; cubeZ[21]=5;

		cubeX[22]=547; cubeY[22]=152; cubeZ[22]=15;
		cubeX[23]=536; cubeY[23]=147; cubeZ[23]=15;
		cubeX[24]=536; cubeY[24]=158; cubeZ[24]=15;

		cubeX[25]=536; cubeY[25]=152; cubeZ[25]=25;

		cubeX[26]=479; cubeY[26]=94; cubeZ[26]=5;		// line
		cubeX[27]=479; cubeY[27]=cubeY[26]+24; cubeZ[27]=5;
		cubeX[28]=479; cubeY[28]=cubeY[27]+24; cubeZ[28]=5;
		cubeX[29]=479; cubeY[29]=cubeY[28]+24; cubeZ[29]=5;
		cubeX[30]=479; cubeY[30]=cubeY[29]+23; cubeZ[30]=5;
		cubeX[31]=479; cubeY[31]=cubeY[30]+23; cubeZ[31]=5;

		for (i=0; i < 32; i++) {
			cube[i] = cs.field;				// on field
			cubeR[i] = 0;					// rotate
		}
		cubeX[32]=0; cubeY[32]=0; cubeZ[32]=0; cube[32]=cs.robot;	// my robot
		cubeX[33]=0; cubeY[33]=0; cubeZ[33]=0; cube[33]=cs.robot;	// partner 1
		cubeX[34]=0; cubeY[34]=0; cubeZ[34]=0; cube[34]=cs.robot;	// partner 2
		cubeX[35]=0; cubeY[35]=0; cubeZ[35]=0; cube[35]=cs.robot;	// moving opponent
		cubeX[36]=0; cubeY[36]=0; cubeZ[36]=0; cube[36]=cs.robot;	// opponent 2
		cubeX[37]=0; cubeY[37]=0; cubeZ[37]=0; cube[37]=cs.robot;	// opponent 3

//		for (i=38; i < maxCubes; i++)
//		for (i=38; i < 45; i++)	// 6
		i=38;
		for (j=0; j < 6; j++,i++)	// 6
		{
			cube[i] = cs.field;
			cubeX[i] = 111;
			cubeY[i] = 22;
			cubeR[i] = Math.PI/4;
			cubeZ[i] = 0;
		}
//		for (i=45; i < 52; i++)		// 5
		for (j=0; j < 5; j++,i++)	// 5
		{
			cube[i] = cs.field;
			cubeX[i] = 111;
			cubeY[i] = 283;
			cubeR[i] = Math.PI/4;
			cubeZ[i] = 0;
		}
//		for (i=52; i < 59; i++)	// 6
		for (j=0; j < 6; j++,i++)	// 6
		{
			cube[i] = cs.field;
			cubeX[i] = 641;
			cubeY[i] = 24;
			cubeR[i] = Math.PI/4;
			cubeZ[i] = 0;
		}
//		for (i=59; i < 66; i++)	// 5
		for (j=0; j < 5; j++,i++)	// 5
		{
			cube[i] = cs.field;
			cubeX[i] = 641;
			cubeY[i] = 284;
			cubeR[i] = Math.PI/4;
			cubeZ[i] = 0;
		}
	}

	var coloro = 1.0;
	var brighter = true;

	function drawCubes(){
		cycle++;
		ctx.strokeStyle = "#DAA520";
		ctx.fillStyle = "yellow";
		ctx.lineWidth=1;

		for (i=0; i < maxCubes; i++)
		{
			if ((cube[i] == cs.field)||(cube[i] == cs.scored)||(cube[i] == cs.reserve)) {
				ctx.translate(cubeX[i],cubeY[i]);
				ctx.rotate(cubeR[i]);
				ctx.strokeRect(-5,-5,10,10);
				ctx.fillRect(-5,-5,10,10);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			}
		}

		if (brighter) {
			coloro += 0.05;
			if (coloro >= 1.0) {
				coloro = 1.0;
				brighter = false;
			}
		}else{
			coloro -= 0.05;
			if (coloro <= 0.05) {
				coloro = 0.05;
				brighter = true;
			}
		}

		for (i=0; i< Red_Boost; i++){
			ctx.fillStyle = (Red_Boost_PU == pus.active)?"red":(Red_Boost_PU == pus.queued)?"rgba(255,0,0,"+coloro+")":"yellow";
			ctx.fillRect(15+(i*12),135,10,10);
		}
		for (i=0; i< Red_Levitate; i++){
//			ctx.fillStyle = Red_Levitate_PU?"red":"yellow";
			ctx.fillStyle = (Red_Levitate_PU == pus.active)?"red":(Red_Levitate_PU == pus.queued)?"rgba(255,0,0,"+coloro+")":"yellow";
			ctx.fillRect(15+(i*12),148,10,10);
		}
		for (i=0; i< Red_Force; i++){
//			ctx.fillStyle = Red_Force_PU?"red":"yellow";
			ctx.fillStyle = (Red_Force_PU == pus.active)?"red":(Red_Force_PU == pus.queued)?"rgba(255,0,0,"+coloro+")":"yellow";
			ctx.fillRect(15+(i*12),161,10,10);
		}
		for (i=0; i< Blu_Boost; i++){
//			ctx.fillStyle =Blu_Boost_PU?"blue":"yellow";
			ctx.fillStyle = (Blu_Boost_PU == pus.active)?"blue":(Blu_Boost_PU == pus.queued)?"rgba(0,0,255,"+coloro+")":"yellow";
			ctx.fillRect(725-(i*12),161,10,10);
		}
		for (i=0; i< Blu_Levitate; i++){
//			ctx.fillStyle = Blu_Levitate_PU?"blue":"yellow";
			ctx.fillStyle = (Blu_Levitate_PU == pus.active)?"blue":(Blu_Levitate_PU == pus.queued)?"rgba(0,0,255,"+coloro+")":"yellow";
			ctx.fillRect(725-(i*12),148,10,10);
		}
		for (i=0; i< Blu_Force; i++){
//			ctx.fillStyle = Blu_Force_PU?"blue":"yellow";
			ctx.fillStyle = (Blu_Force_PU == pus.active)?"blue":(Blu_Force_PU == pus.queued)?"rgba(0,0,255,"+coloro+")":"yellow";
			ctx.fillRect(725-(i*12),135,10,10);
		}

		ctx.strokeStyle = "black";
//		ctx.strokeText( Red_Boost, 5,141 );
//		ctx.strokeText( Red_Levitate, 5,156 );
//		ctx.strokeText( Red_Force, 5,171 );
		ctx.strokeText( "F", 5,171 );
		ctx.strokeText( "L", 5,156 );
		ctx.strokeText( "B", 5,141 );

		ctx.strokeStyle = "black";
//		ctx.strokeText( Blu_Boost, 742,141 );
//		ctx.strokeText( Blu_Levitate, 742,156 );
//		ctx.strokeText( Blu_Force, 742,171 );
		ctx.strokeText( "B", 742,171 );
		ctx.strokeText( "L", 742,156 );
		ctx.strokeText( "F", 742,141 );
	}

	function updateVaultScore(){
		document.getElementById("redvault").innerHTML = (Red_Boost*5)+(Red_Levitate*5)+(Red_Force*5);
		document.getElementById("redvault2").innerHTML = (Red_Boost*5)+"-"+(Red_Levitate*5)+"-"+(Red_Force*5);
		document.getElementById("bluevault").innerHTML = (Blu_Boost*5)+(Blu_Levitate*5)+(Blu_Force*5);
		document.getElementById("bluevault2").innerHTML = (Blu_Boost*5)+"-"+(Blu_Levitate*5)+"-"+(Blu_Force*5);
	}

	function addToVault_Boost(which){
		if (which == "red"){
			if ((RcountRed > 0)&&(Red_Boost < 3)) {
				cube[ReserveRed[--RcountRed]] = cs.boost;
				Red_Boost++;
			}
		}else{
			if ((RcountBlu > 0)&&(Blu_Boost < 3)) {
				cube[ReserveBlu[--RcountBlu]] = cs.boost;
				Blu_Boost++;
			}
		}
		updateVaultScore();
	}
	function addToVault_Levitate(which){
		if (which == "red"){
			if ((RcountRed > 0)&&(Red_Levitate < 3)) {
				cube[ReserveRed[--RcountRed]] = cs.levitate;
				Red_Levitate++;
			}
		}else{
			if ((RcountBlu > 0)&&(Blu_Levitate < 3)) {
				cube[ReserveBlu[--RcountBlu]] = cs.levitate;
				Blu_Levitate++;
			}
		}
		updateVaultScore();
	}
	function addToVault_Force(which){
		if (which == "red"){
			if ((RcountRed > 0)&&(Red_Force < 3)) {
				cube[ReserveRed[--RcountRed]] = cs.force;
				Red_Force++;
			}
		}else{
			if ((RcountBlu > 0)&&(Blu_Force < 3)) {
				cube[ReserveBlu[--RcountBlu]] = cs.force;
				Blu_Force++;
			}
		}
		updateVaultScore();
	}


/* *************************************   Vault Function  ****************************************

    FORCE   LEVITATE	BOOST
    1,2,3		3		1,2,3

    W,S,W+S            W,S,W+S ( 2pts / s )

	There is no queue for Levitate

    Once you request a power up, you can't hit any others until your power up is finished ( Q then Act then done )
*/
	var puTimer;
	var puCycle = 0;

	function getNextPowerUp() {
		if (Red_Boost_PU == pus.queued) {currentPU = 1;	Red_Boost_PU = pus.active; }	// get next queued req
		else if (Blu_Boost_PU == pus.queued) {currentPU = 4; Blu_Boost_PU = pus.active;}
		else if (Red_Force_PU == pus.queued) {currentPU = 3; Red_Force_PU = pus.active;}
		else if (Blu_Force_PU == pus.queued) {currentPU = 6; Blu_Force_PU = pus.active;}
		else currentPU = 0;
	}
	function startNextPowerUp(){

		getNextPowerUp();

		if (currentPU != 0) {

			puTimer = setInterval(endPowerUp, 10000/timeK);		// 10 seconds
		}
	}



	function endPowerUp(){
		clearInterval(puTimer);
		if (Red_Boost_PU == pus.active) Red_Boost_PU == pus.done;
		else if (Red_Force_PU == pus.active) Red_Force_PU == pus.done;
		else if (Blu_Boost_PU == pus.active) Blu_Boost_PU == pus.done;
		else if (Blu_Force_PU == pus.active) Blu_Force_PU == pus.done;

		startNextPowerUp();
	}
