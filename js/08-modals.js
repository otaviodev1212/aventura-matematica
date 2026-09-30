let quizSelection=0, quizOptionsData=[];
  function openQuiz(monster){
    uiMode='quiz';
    const spec = PHASES[phaseIdx];
    const q = window.__phaseQuestions[monster.questionIdx];
    document.getElementById('quizMonsterLabel').textContent = 'MONSTRO DERROTADO! · ' + spec.subject.toUpperCase();
    document.getElementById('quizQuestion').textContent = q.q;
    const opts = q.opts.map((text,i)=>({text, correct:i===q.correct}));
    quizOptionsData = shuffle(opts);
    quizSelection = 0;
    const container = document.getElementById('quizOptions');
    container.innerHTML='';
    document.getElementById('feedbackMsg').textContent='';
    quizOptionsData.forEach((opt,i)=>{
      const div = document.createElement('div');
      div.className='quizOpt';
      div.textContent = (i+1)+') '+opt.text;
      div.addEventListener('click', ()=>resolveQuiz(i));
      container.appendChild(div);
    });
    updateQuizHighlight();
    quizModal.classList.add('show');
    setFooter('');
  }
  function updateQuizHighlight(){ document.querySelectorAll('#quizOptions .quizOpt').forEach((el,i)=> el.classList.toggle('selected', i===quizSelection)); }
  function resolveQuiz(i){
    const opt = quizOptionsData[i];
    const els = document.querySelectorAll('#quizOptions .quizOpt');
    if(!opt || !els[i]) return;
    if(opt.correct){
      els[i].classList.add('correctFlash'); sfx.correct();
      score += 100; correctCount++;
      document.getElementById('feedbackMsg').textContent = 'Correto! +100 pontos';
    } else {
      els[i].classList.add('wrongFlash'); sfx.wrong();
      coinCount = Math.max(0, coinCount-WRONG_PENALTY_COINS); wrongCount++;
      document.getElementById('feedbackMsg').textContent = 'Errado! -'+WRONG_PENALTY_COINS+' moedas. Resposta certa: ' + (quizOptionsData.find(o=>o.correct)||{text:''}).text;
    }
    setTimeout(()=>{
      quizModal.classList.remove('show');
      uiMode='playing'; player.invuln=40;
      setFooter('L2 Ataca · ↑ Pula · Triângulo Interage · O Voltar ao Mapa');
    }, 1000);
  }

  let gateKeySelection=0;
  const gateKeys = ['1','2','3','4','5','6','7','8','9','←','0','OK'];
  function openGate(gate){
    uiMode='gate'; currentGate = gate; gateAnswerStr='';
    document.getElementById('gateLabel').textContent = 'PORTÃO ' + gate.label.toUpperCase() + ' · CALCULE PARA AVANÇAR';
    document.getElementById('gateQuestion').textContent = gate.q;
    document.getElementById('gateAnswerDisplay').textContent = '_';
    document.getElementById('gateFeedback').textContent='';
    const kp = document.getElementById('gateKeypad');
    kp.innerHTML=''; gateKeySelection=0;
    gateKeys.forEach((k)=>{
      const div = document.createElement('div');
      div.className='keyBtn'+(k==='OK'?' wide':'');
      div.textContent = k;
      div.addEventListener('click', ()=>pressGateKey(k));
      kp.appendChild(div);
    });
    updateGateHighlight();
    gateModal.classList.add('show');
    setFooter('');
  }
  function updateGateHighlight(){ document.querySelectorAll('#gateKeypad .keyBtn').forEach((el,i)=>el.classList.toggle('selectedKey', i===gateKeySelection)); }
  function pressGateKey(k){
    sfx.click();
    if(k==='←'){ gateAnswerStr = gateAnswerStr.slice(0,-1); }
    else if(k==='OK'){ submitGate(); return; }
    else { if(gateAnswerStr.length<6) gateAnswerStr += k; }
    document.getElementById('gateAnswerDisplay').textContent = gateAnswerStr.length? gateAnswerStr : '_';
  }
  function submitGate(){
    const correct = gateAnswerStr.trim() === currentGate.answer.trim();
    if(correct){
      sfx.gateWin(); score += 200 + currentGate.tier*100; correctCount++;
      document.getElementById('gateFeedback').textContent = 'Correto! Caminho liberado!';
      currentGate.cleared = true;
      setTimeout(()=>{
        gateModal.classList.remove('show');
        uiMode='playing'; player.invuln=40;
        setFooter('L2 Ataca · ↑ Pula · Triângulo Interage · O Voltar ao Mapa');
      }, 900);
    } else {
      sfx.wrong();
      coinCount = Math.max(0, coinCount-WRONG_PENALTY_COINS); wrongCount++;
      document.getElementById('gateFeedback').textContent = 'Errado! -'+WRONG_PENALTY_COINS+' moedas. Tente de novo.';
      gateAnswerStr=''; document.getElementById('gateAnswerDisplay').textContent='_';
    }
  }

  const HEART_PRICE = 10;
  let mageCooldown=0;
  function openMage(){
    uiMode='mage';
    const full = heartsUnits>=MAX_HEART_UNITS;
    document.getElementById('mageText').textContent = full ? 'Sua vida já está cheia!' : 'Quer recuperar 1 coração por '+HEART_PRICE+' moedas?';
    document.getElementById('mageBuyBtn').style.display = full? 'none':'inline-block';
    document.getElementById('mageBuyBtn').disabled = coinCount<HEART_PRICE;
    mageModal.classList.add('show');
    setFooter('X Comprar · O Fechar');
  }
  function closeMage(){
    mageModal.classList.remove('show');
    uiMode='playing'; player.invuln=30; mageCooldown=45;
    setFooter('L2 Ataca · ↑ Pula · Triângulo Interage · O Voltar ao Mapa');
  }
  document.getElementById('mageBuyBtn').addEventListener('click', ()=>{
    if(coinCount>=HEART_PRICE && heartsUnits<MAX_HEART_UNITS){
      coinCount -= HEART_PRICE;
      heartsUnits = Math.min(MAX_HEART_UNITS, heartsUnits+2);
      sfx.heart(); updateHeartsHud();
      openMage();
    }
  });
  document.getElementById('mageCloseBtn').addEventListener('click', closeMage);

  function openChestHint(){
    uiMode='chest';
    document.getElementById('chestHintText').textContent = PHASES[phaseIdx].hint;
    chestModal.classList.add('show');
    setFooter('X ou O Fechar');
  }
  function closeChest(){
    chestModal.classList.remove('show');
    uiMode='playing'; player.invuln=30;
    setFooter('L2 Ataca · ↑ Pula · Triângulo Interage · O Voltar ao Mapa');
  }
  document.getElementById('chestCloseBtn').addEventListener('click', closeChest);