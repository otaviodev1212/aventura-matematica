  const startOverlay = document.getElementById('startOverlay');
  const optionsOverlay = document.getElementById('optionsOverlay');
  const creditsOverlay = document.getElementById('creditsOverlay');
  const phaseSelectOverlay = document.getElementById('phaseSelectOverlay');
  const phaseIntroOverlay = document.getElementById('phaseIntroOverlay');
  const endOverlay = document.getElementById('endOverlay');
  const quizModal = document.getElementById('quizModal');
  const gateModal = document.getElementById('gateModal');
  const mageModal = document.getElementById('mageModal');
  const chestModal = document.getElementById('chestModal');
  const scoreHud = document.getElementById('scoreHud');
  const coinsHud = document.getElementById('coinsHud');
  const heartsHud = document.getElementById('heartsHud');
  const barFill = document.getElementById('barFill');
  const footerHint = document.getElementById('footerHint');

  function setFooter(text){ footerHint.textContent = text; }
  function updateHeartsHud(){
    heartsHud.innerHTML='';
    for(let i=0;i<5;i++){
      const slotVal = Math.max(0, Math.min(2, heartsUnits - i*2));
      const pct = slotVal/2*100;
      const slot = document.createElement('div');
      slot.className='heartSlot';
      slot.innerHTML = '<span class="bgHeart">🤍</span><span class="fgHeart" style="clip-path:inset(0 '+(100-pct)+'% 0 0)">❤️</span>';
      heartsHud.appendChild(slot);
    }
  }
  function updateBarHud(){ barFill.style.width = Math.max(0,playerBar)+'%'; }
  function hideAllOverlays(){ [startOverlay,optionsOverlay,creditsOverlay,phaseSelectOverlay,phaseIntroOverlay,endOverlay].forEach(o=>o.classList.remove('show')); }

  const menuItems = ['menuPlay','menuContinue','menuOptions','menuCredits','menuExit'];
  let menuSelection=0;
  function refreshMenuState(){ document.getElementById('menuContinue').disabled = getUnlocked()<=1; updateMenuHighlight(); }
  function updateMenuHighlight(){ menuItems.forEach((id,i)=>{ document.getElementById(id).classList.toggle('selected', i===menuSelection); }); }
  function activateMenuItem(i){ const id = menuItems[i]; if(id==='menuContinue' && document.getElementById('menuContinue').disabled) return; document.getElementById(id).click(); }

  document.getElementById('menuPlay').addEventListener('click', ()=>{
    score=0; coinCount=0; setUnlocked(1);
    hideAllOverlays();
    phaseIdx=0;
    loadPhase(0);
    showPhaseIntro();
  });
  document.getElementById('menuContinue').addEventListener('click', ()=>{
    if(document.getElementById('menuContinue').disabled) return;
    hideAllOverlays(); buildPhaseSelectUI(); phaseSelectOverlay.classList.add('show');
    uiMode='phaseSelect'; setFooter('↑↓←→ Navegar   X Escolher');
  });
  document.getElementById('menuOptions').addEventListener('click', ()=>{ hideAllOverlays(); optionsOverlay.classList.add('show'); uiMode='options'; setFooter('O Voltar'); });
  document.getElementById('menuCredits').addEventListener('click', ()=>{ hideAllOverlays(); creditsOverlay.classList.add('show'); uiMode='credits'; setFooter('O Voltar'); });
  document.getElementById('menuExit').addEventListener('click', ()=>{
    try{ window.close(); }catch(e){}
    setTimeout(()=>{ alert('Você já pode fechar esta aba. Obrigado por jogar!'); }, 50);
  });
  document.getElementById('optionsBackBtn').addEventListener('click', backToStart);
  document.getElementById('creditsBackBtn').addEventListener('click', backToStart);
  function backToStart(){ hideAllOverlays(); startOverlay.classList.add('show'); uiMode='start'; refreshMenuState(); setFooter('↑↓ Navegar   X Confirmar'); }
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', ()=>{ masterVolume = volumeSlider.value/100; document.getElementById('optVolumeVal').textContent = volumeSlider.value+'%'; });

  let phaseNodeSelection=0;
  function buildPhaseSelectUI(){
    const unlocked = getUnlocked();
    phaseNodeSelection = Math.min(phaseNodeSelection, PHASES.length-1);
    const container = document.getElementById('trailNodes');
    container.innerHTML='';
    PHASES.forEach((spec,i)=>{
      const node = document.createElement('button');
      node.className = 'phaseNode' + (i<unlocked?'':' locked') + (i===phaseNodeSelection?' selected':'');
      node.disabled = i>=unlocked;
      node.innerHTML = '<span class="circle">'+(i<unlocked?(i+1):'🔒')+'</span><span class="label">'+spec.name.split('·')[1].trim()+'</span>';
      node.addEventListener('click', ()=>{ if(i>=unlocked) return; selectPhaseFromMap(i); });
      container.appendChild(node);
    });
  }
  function selectPhaseFromMap(i){ phaseSelectOverlay.classList.remove('show'); phaseIdx=i; loadPhase(i); showPhaseIntro(); }
  function showPhaseIntro(){
    const spec = PHASES[phaseIdx];
    document.getElementById('phaseIntroTitle').textContent = spec.name;
    document.getElementById('phaseIntroSubject').textContent = "Assunto: " + spec.subject;
    document.getElementById('phaseIntroText').textContent = spec.intro;
    phaseIntroOverlay.classList.add('show');
    uiMode='phaseIntro'; setFooter('X Começar');
  }
  document.getElementById('phaseIntroBtn').addEventListener('click', ()=>{
    phaseIntroOverlay.classList.remove('show');
    started = true; uiMode='playing';
    setFooter('L2 Ataca · ↑ Pula · Triângulo Interage · O Voltar ao Mapa');
  });

  let bestScore=0;
  try{ bestScore = parseInt(localStorage.getItem('mathgame_best')||'0',10)||0; }catch(e){}
  function saveBest(){ if(score>bestScore){ bestScore=score; try{ localStorage.setItem('mathgame_best', String(bestScore)); }catch(e){} } }
  function goToMap(){
    hideAllOverlays(); buildPhaseSelectUI(); phaseSelectOverlay.classList.add('show');
    uiMode='phaseSelect'; setFooter('↑↓←→ Navegar   X Escolher');
  }
  function statsText(){ return 'Acertos: '+correctCount+'  ·  Erros: '+wrongCount; }

  function gameOverFn(){
    started=false; saveBest();
    document.getElementById('endTitle').textContent='Fim de Jogo';
    document.getElementById('endText').textContent='Pontuação: '+score+' · Recorde: '+bestScore+' · Seu progresso de fases foi mantido!';
    document.getElementById('endStats').textContent = statsText();
    const btn=document.getElementById('endBtn'); btn.textContent='MAPA DE FASES'; btn.onclick=goToMap;
    endOverlay.classList.add('show'); uiMode='end'; setFooter('X Confirmar');
  }
  function completePhase(){
    started=false; saveBest();
    const unlocked = Math.min(Math.max(getUnlocked(), phaseIdx+2), PHASES.length);
    setUnlocked(unlocked);
    document.getElementById('endStats').textContent = statsText();
    if(phaseIdx < PHASES.length-1){
      document.getElementById('endTitle').textContent='Fase Concluída! 🏁';
      document.getElementById('endText').textContent='Pontuação: '+score+' · Nova fase liberada no mapa!';
    } else {
      document.getElementById('endTitle').textContent='Você Venceu o Jogo! 🏆';
      document.getElementById('endText').textContent='Pontuação final: '+score+' · Recorde: '+bestScore;
    }
    const btn=document.getElementById('endBtn'); btn.textContent='MAPA DE FASES'; btn.onclick=goToMap;
    endOverlay.classList.add('show'); uiMode='end'; setFooter('X Confirmar');
  }