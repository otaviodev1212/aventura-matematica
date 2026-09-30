// Teclas pressionadas são consultadas pelo loop do jogo para manter o movimento
// contínuo; ações de menu e ações pontuais passam pelos mesmos handlers do gamepad.
const keys = {};
window.addEventListener('keydown', e=>{
  const k = e.key.toLowerCase();
  if(['arrowleft','arrowright','arrowup','arrowdown',' ','w','a','d','x','k','enter','escape','backspace','e'].includes(k)) e.preventDefault();
  keys[k]=true;
  if((k==='x'||k==='k') && !e.repeat) attackQueued=true;
  if(k==='enter' && !e.repeat) onConfirmPress();
  if((k==='escape'||k==='backspace') && !e.repeat) onBackPress();
  if(k==='e' && !e.repeat) onInteractPress();
  if(!e.repeat) onDirPress(k);
});
window.addEventListener('keyup', e=>{ keys[e.key.toLowerCase()]=false; });

// Camada comum de navegação: teclado e controle enviam as mesmas direções,
// sem duplicar as regras específicas de cada tela.
function onDirPress(k){
  if(uiMode==='start'){
    if(k==='arrowup'||k==='w'){ menuSelection=(menuSelection-1+menuItems.length)%menuItems.length; updateMenuHighlight(); }
    else if(k==='arrowdown'||k==='s'){ menuSelection=(menuSelection+1)%menuItems.length; updateMenuHighlight(); }
  } else if(uiMode==='phaseSelect'){
    if(k==='arrowleft'||k==='a'){ phaseNodeSelection=(phaseNodeSelection-1+PHASES.length)%PHASES.length; buildPhaseSelectUI(); }
    else if(k==='arrowright'||k==='d'){ phaseNodeSelection=(phaseNodeSelection+1)%PHASES.length; buildPhaseSelectUI(); }
  } else if(uiMode==='quiz'){
    if(k==='arrowup'||k==='w'){ quizSelection=(quizSelection-1+quizOptionsData.length)%quizOptionsData.length; updateQuizHighlight(); }
    else if(k==='arrowdown'||k==='s'){ quizSelection=(quizSelection+1)%quizOptionsData.length; updateQuizHighlight(); }
  } else if(uiMode==='gate'){
    if(k==='arrowleft'){ gateKeySelection=(gateKeySelection-1+gateKeys.length)%gateKeys.length; updateGateHighlight(); }
    else if(k==='arrowright'){ gateKeySelection=(gateKeySelection+1)%gateKeys.length; updateGateHighlight(); }
    else if(k==='arrowup'){ gateKeySelection=(gateKeySelection-3+gateKeys.length)%gateKeys.length; updateGateHighlight(); }
    else if(k==='arrowdown'){ gateKeySelection=(gateKeySelection+3)%gateKeys.length; updateGateHighlight(); }
  }
}

// Handlers semânticos compartilhados entre teclado e botões do controle.
function onConfirmPress(){
  if(uiMode==='start'){ activateMenuItem(menuSelection); }
  else if(uiMode==='phaseSelect'){ const u=getUnlocked(); if(phaseNodeSelection<u) selectPhaseFromMap(phaseNodeSelection); }
  else if(uiMode==='phaseIntro'){ document.getElementById('phaseIntroBtn').click(); }
  else if(uiMode==='end'){ document.getElementById('endBtn').click(); }
  else if(uiMode==='quiz'){ resolveQuiz(quizSelection); }
  else if(uiMode==='gate'){ pressGateKey(gateKeys[gateKeySelection]); }
  else if(uiMode==='mage'){ document.getElementById('mageBuyBtn').click(); }
  else if(uiMode==='chest'){ document.getElementById('chestCloseBtn').click(); }
}
function onBackPress(){
  if(uiMode==='options'||uiMode==='credits'){ backToStart(); }
  else if(uiMode==='phaseSelect'){ backToStart(); }
  else if(uiMode==='mage'){ closeMage(); }
  else if(uiMode==='chest'){ closeChest(); }
  else if(uiMode==='playing'){ goToMap(); }
}
function onInteractPress(){ if(uiMode==='playing' && nearMage){ openMage(); } }

// Índices do mapeamento padrão Gamepad API (PS, Xbox e controles genéricos
// reconhecidos pelo navegador). O quadro anterior detecta novos pressionamentos.
const GP_BUTTON = { CONFIRM:0, BACK:1, ATTACK_ALT:2, INTERACT:3, LEFT_TRIGGER:6, RIGHT_TRIGGER:7, DPAD_UP:12, DPAD_DOWN:13, DPAD_LEFT:14, DPAD_RIGHT:15 };
let prevButtons=[];
let prevAxes=[];

function pollGamepad(){
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  return pads && (pads[0] || null);
}
function gpButtonHeld(gp, idx){
  const button = gp && gp.buttons && gp.buttons[idx];
  return !!(button && (typeof button === 'object' ? button.pressed : button));
}
function gpEdge(gp, idx){ return gpButtonHeld(gp,idx) && !prevButtons[idx]; }
function axisHeld(gp, idx, dir){
  const val = gp && gp.axes ? (gp.axes[idx]||0) : 0;
  return dir<0 ? val<-0.5 : val>0.5;
}

// D-pad padrão usa botões; eixos extras 4/5 também cobrem alguns controles
// genéricos antigos que expõem o direcional como eixo.
function gpDirectionHeld(gp, direction){
  if(direction==='up') return axisHeld(gp,1,-1) || axisHeld(gp,5,-1) || gpButtonHeld(gp,GP_BUTTON.DPAD_UP);
  if(direction==='down') return axisHeld(gp,1,1) || axisHeld(gp,5,1) || gpButtonHeld(gp,GP_BUTTON.DPAD_DOWN);
  if(direction==='left') return axisHeld(gp,0,-1) || axisHeld(gp,4,-1) || gpButtonHeld(gp,GP_BUTTON.DPAD_LEFT);
  return axisHeld(gp,0,1) || axisHeld(gp,4,1) || gpButtonHeld(gp,GP_BUTTON.DPAD_RIGHT);
}
function gpDirectionEdge(gp, direction){
  const previous = { axes:prevAxes, buttons:prevButtons };
  return gpDirectionHeld(gp,direction) && !gpDirectionHeld(previous,direction);
}
function rememberGamepadState(gp){
  prevButtons = gp && gp.buttons ? Array.from(gp.buttons, b=>!!(b && (typeof b==='object' ? b.pressed : b))) : [];
  prevAxes = gp && gp.axes ? Array.from(gp.axes) : [];
}