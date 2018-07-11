//Instruction tab - scroll controllable with LF js
//When both players hit START, the instruction screen will disappear
//and play can begin.

//var gp2 = navigator.getGamepads()[1];

var p1_ready = false;
var p2_ready = false;

window.addEventListener("gamepadconnected", init());

function init(){
  var gp1 = navigator.getGamepads()[0];
  var gp2 = navigator.getGamepads()[1];
  console.log("Gamepad connected");
  setInterval(handleGamepad,100);
}

function handleGamepad(){
  var gp1 = navigator.getGamepads()[0];
  var gp2 = navigator.getGamepads()[1];
  var GP1_axis2 = gp1.axes[1]; //Left Y. //might not be correct //2

  // //LF stick (player 1) scroll up/down
  if(GP1_axis2 < -0.4){
    scrollY(-50); //-200 //-100
  }else if(GP1_axis2 > 0.4){
    scrollY(50); //200 //100
  }

  // //Both players press the START button
  if(gp1.buttons[9].pressed){ //.value
    p1_ready = true;
  //  alert("PLAYER ONE IS " + p1_ready);
  }
  if(gp2.buttons[9].pressed){ //.value
    p2_ready = true;
  //  alert("PLAYER TWO IS " + p2_ready);
  }
 startGame();
}

function scrollY(y){window.scrollBy(0,y);}

function startGame(){
  if(p1_ready && p2_ready) location.href="../GameSimulator.html"; //goes to next page when both players ready
  // alert("PLAYER ONE IS " + p1_ready + "PLAYER TWO IS " + p2_ready);
}


//temp keyboard controls for proof of concept
function handleKeys(event){
  var key = event.keyCode;

  switch(key){
  //w = scrol up  //s = scroll down
  //space = enter

    case 32: //space
      p1_ready = true;
      p2_ready = true; //true
      startGame();
      break;
    case 83: //s
      // window.scrollBy(0,200);
      scrollY(200);
      break;
    case 87: //w;
      scrollY(-200);
      break;
    default:
      break;
  }
}
