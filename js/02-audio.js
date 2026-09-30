let audioCtx;
  let masterVolume = 0.8;
  function beep(freq, dur, type='square', vol=0.08){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = vol*masterVolume;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.stop(audioCtx.currentTime + dur);
    }catch(e){}
  }
  const sfx = {
    jump: ()=>beep(520,0.12,'square',0.07),
    coin: ()=>{beep(880,0.08,'square',0.08); setTimeout(()=>beep(1320,0.1,'square',0.07),60);},
    hit: ()=>beep(90,0.25,'sawtooth',0.1),
    swing: ()=>beep(700,0.06,'sawtooth',0.06),
    monsterHit: ()=>beep(260,0.08,'square',0.08),
    death: ()=>{beep(200,0.1,'sawtooth',0.09); setTimeout(()=>beep(140,0.15,'sawtooth',0.08),80); setTimeout(()=>beep(100,0.2,'sawtooth',0.07),180);},
    correct: ()=>{[660,880,1100].forEach((f,i)=>setTimeout(()=>beep(f,0.12,'square',0.08), i*70));},
    wrong: ()=>{beep(160,0.2,'sawtooth',0.1); setTimeout(()=>beep(110,0.25,'sawtooth',0.1),90);},
    gateWin: ()=>{[523,659,784,1046,1318].forEach((f,i)=>setTimeout(()=>beep(f,0.18,'square',0.09), i*120));},
    click: ()=>beep(300,0.05,'square',0.05),
    breakSfx: ()=>beep(180,0.1,'sawtooth',0.08),
    heart: ()=>{[500,700].forEach((f,i)=>setTimeout(()=>beep(f,0.14,'square',0.08), i*90));},
    key: ()=>{[700,1000,1300].forEach((f,i)=>setTimeout(()=>beep(f,0.1,'square',0.07), i*60));}
  };