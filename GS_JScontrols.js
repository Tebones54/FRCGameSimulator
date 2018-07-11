window.addEventListener("gamepadconnected", displayInfo(event))

function displayInfo(e)
  {
      console.log("Gamepad connected")
      setInterval(gameUpdate,100);
  }

function gameUpdate()
{
        pollController(0);
        pollController(1,"blue");
        // pollController(2,"red");
        // pollController(3,"blue");
        // pollController(4,"red");
        // pollController(5,"blue");
}


function pollController(index,team){
    var gp = navigator.getGamepads()[index]; //Throws a crazy amount of errors but works???
    var GP_axis1 = gp.axes[1]; // Technically axis 0 is the first axis. Left X and Y.
    var GP_axis2 = gp.axes[2]; // Ditto
    var pressed;
    var resetCounter = 0;
    var startCounter = 0;
// Field Controls. Player 1 has privileges.
    if(index == 0)
    {
      while(gp.buttons[4].value)
      {
      resetCounter++;
      if(resetCounter > 5000000){
      fieldReset(); resetCounter = 0; break;
        }
      }
    }



    if(enabled && index == 0){
//    Forward backward
      if(GP_axis1 < -0.4){
        if(gp.buttons[7].value > .2) Drive_Arcade(20,0);
        else if(gp.buttons[6].value > .2) Drive_Arcade(5,0);
        else Drive_Arcade(10,0);
      }
      if(GP_axis1 > 0.4){
        if(gp.buttons[7].value > .2) Drive_Arcade(-20,0);
        else if(gp.buttons[6].value > .2) Drive_Arcade(-5,0);
        else Drive_Arcade(-10,0);
      }
  //  Rotate
      if(GP_axis2 > 0.4){
        if(gp.buttons[7].value > .2) Drive_Arcade(0,20);
        else if(gp.buttons[6].value > .2) Drive_Arcade(0,5);
        else Drive_Arcade(0,10);
      }
      if(GP_axis2 < -0.4){
        if(gp.buttons[7].value > .2) Drive_Arcade(0,-20);
        else if(gp.buttons[6].value > .2) Drive_Arcade(0,-5);
        else Drive_Arcade(0,-10);
      }
  // Cube Placement
    if(gp.buttons[1].value){
      buttonCounter++;
      if(buttonCounter <= 1){if (hasCube) throwCube(); else grabCube();};
      }
    else if(gp.buttons[0].value){
      buttonCounter++;
      if(buttonCounter <= 1){if (hasCube) pukeCube(); else grabCube();};
      }
    else if(gp.buttons[2].value){
      buttonCounter++;
      if(buttonCounter <= 1){if (hascube) poopCube(); else grabCube();};
      }
  // Powerups
    else if(gp.buttons[12].value){
      buttonCounter++;
      if(buttonCounter <= 1) addToVault_Boost("red");
    }else if(gp.buttons[14].value){
      buttonCounter++;
      if(buttonCounter <= 1) addToVault_Levitate("red");
    }else if(gp.buttons[13].value){
      buttonCounter++;
      if(buttonCounter <= 1) addToVault_Force("red");
    }else if(gp.buttons[3].value){
      climb();
    }
    else buttonCounter = 0;

  }
// End of Controller One
  else if(enabled && index > 0)
  {
    if(GP_axis1 < -0.4){
      if(gp.buttons[7].value > .2) Drive_Arcade_opponent(20,0,index-1);
      else if(gp.buttons[6].value > .2) Drive_Arcade_opponent(5,0,index-1);
      else Drive_Arcade_opponent(10,0,index-1);
    }
    if(GP_axis1 > 0.4){
      if(gp.buttons[7].value > .2) Drive_Arcade_opponent(-20,0,index-1);
      else if(gp.buttons[6].value > .2) Drive_Arcade_opponent(-5,0,index-1);
      else Drive_Arcade_opponent(-10,0,index-1);
    }
//  Rotate
    if(GP_axis2 > 0.4){
      if(gp.buttons[7].value > .2) Drive_Arcade_opponent(0,20,index-1);
      else if(gp.buttons[6].value > .2) Drive_Arcade_opponent(0,5,index-1);
      else Drive_Arcade_opponent(0,10,index-1);
    }
    if(GP_axis2 < -0.4){
      if(gp.buttons[7].value > .2) Drive_Arcade_opponent(0,-20,index-1);
      else if(gp.buttons[6].value > .2) Drive_Arcade_opponent(0,-5,index-1);
      else Drive_Arcade_opponent(0,-10,index-1);
    }
// Cube Placement
  if(gp.buttons[1].value){
    buttonCounter2++;
   if(buttonCounter2 <= 1){if (OhasCube[index-1])  throwCube_opponent(index-1); else grabCube_opponent(index-1);}
    }
  else if(gp.buttons[0].value){
    buttonCounter2++;
    if(buttonCounter2 <= 1){if (OhasCube[index-1]) pukeCube_opponent(index-1); else grabCube_opponent(index-1);}
    }
  else if(gp.buttons[2].value){
    buttonCounter2++;
    if(buttonCounter2 <= 1){if (OhasCube[index-1]) poopCube_opponent(index-1); else grabCube_opponent(index-1);}
    }
  else if(gp.buttons[3].value){
    climb_opponent(0);
  }
  // Powerups
  else if(gp.buttons[12].value){
    buttonCounter2++;
    if(buttonCounter2 <= 1) addToVault_Force("blue");
  }else if(gp.buttons[15].value){
    buttonCounter2++;
    if(buttonCounter2 <= 1) addToVault_Levitate("blue");
  }else if(gp.buttons[13].value){
    buttonCounter2++;
    if(buttonCounter2 <= 1) addToVault_Boost("blue");
  }
  else buttonCounter2 = 0;
}
}
