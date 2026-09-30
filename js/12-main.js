
function loop(){
    update();
    if(uiMode==='playing' || uiMode==='quiz' || uiMode==='gate' || uiMode==='mage' || uiMode==='chest'){
      if(PHASES[phaseIdx]) drawScene();
    } else {
      drawMenuScene();
    }
    requestAnimationFrame(loop);
  }
  refreshMenuState();
  updateHeartsHud();
  updateBarHud();
  setFooter('↑↓ Navegar   X Confirmar');
  drawMenuScene();
  loop();