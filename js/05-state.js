
let phaseIdx = 0;
  let blocks=[], coins=[], monsters=[], particles=[], barrels=[], pickups=[], gates=[], dyingList=[];
  let mage=null, chestMiniboss=null, chest=null;
  let flagX=null;
  let cameraX=0, time=0;
  let score=0, coinCount=0;
  let heartsUnits = MAX_HEART_UNITS;
  let playerBar = BAR_MAX;
  let started=false;
  let uiMode='start';
  let currentGate=null;
  let gateAnswerStr='';
  let landTimer=0;
  let attackQueued=false, interactQueued=false;
  let correctCount=0, wrongCount=0;
  let hasKey=false, nearMage=false;

  const player = { x:64,y:200,w:22,h:30,vx:0,vy:0,onGround:false,facing:1,invuln:0,attackTimer:0,attackCooldown:0 };

  function isSolid(t){ return t.type==='ground'||t.type==='brick'||t.type==='mystery'; }
  function getUnlocked(){ try{ return Math.max(1, parseInt(localStorage.getItem('mathgame_unlocked')||'1',10)||1); }catch(e){ return 1; } }
  function setUnlocked(n){ try{ localStorage.setItem('mathgame_unlocked', String(n)); }catch(e){} }

  function loadPhase(idx){
    const spec = PHASES[idx];
    const full = Object.assign({}, LAYOUT, spec);
    const rows = buildRows(full);
    blocks=[]; coins=[]; monsters=[]; particles=[]; barrels=[]; pickups=[]; dyingList=[]; flagX=null;
    for(let y=0;y<H_ROWS;y++){
      for(let x=0;x<full.width;x++){
        const ch = rows[y][x];
        const px=x*TILE, py=y*TILE;
        if(ch==='#') blocks.push({x:px,y:py,type:'ground'});
        else if(ch==='B') blocks.push({x:px,y:py,type:'brick',bump:0});
        else if(ch==='?') blocks.push({x:px,y:py,type:'mystery',used:false,bump:0});
        else if(ch==='C') coins.push({x:px+8,y:py+8,taken:false,phase:Math.random()*Math.PI*2});
        else if(ch==='F') flagX = px;
      }
    }
    const shuffledQ = shuffle(spec.questions);
    LAYOUT.monstersX.forEach((mx,i)=>{
      monsters.push({
        x:mx*TILE, y:GROUND_ROW*TILE-28, w:26,h:26, dir:-1, startX:mx*TILE, range:50,
        alive:true, dying:false, dyingTimer:0, kind:spec.monsterKind, type:'normal',
        hp:40, maxHp:40, attackCd:0, questionIdx: i % shuffledQ.length,
        vx:0, vy:0, onGround:false, knockbackVx:0, knockbackTimer:0, knockbackCooldown:0
      });
    });
    window.__phaseQuestions = shuffledQ;

    LAYOUT.barrelsX.forEach((bx)=>{
      barrels.push({ x:bx*TILE, y:GROUND_ROW*TILE-22, w:22,h:22, alive:true, willDropHeart: pseudoRand(bx+idx*100)<0.4 });
    });

    mage = { x:LAYOUT.mageTileX*TILE, y:GROUND_ROW*TILE-34, w:24,h:34 };

    chestMiniboss = { x:LAYOUT.chestMinibossTileX*TILE, y:10*TILE-34, w:34,h:34, dir:-1, startX:LAYOUT.chestMinibossTileX*TILE, range:26, alive:true, dying:false, dyingTimer:0, kind:spec.monsterKind, type:'chestboss', hp:65, maxHp:65, attackCd:0, vx:0, vy:0, onGround:false, knockbackVx:0, knockbackTimer:0, knockbackCooldown:0 };
    chest = { x:LAYOUT.chestTileX*TILE, y:10*TILE-20, w:24,h:20, opened:false };
    hasKey = false;

    gates = LAYOUT.gateXTiles.map((gx,i)=>({
      x:gx*TILE, y:GROUND_ROW*TILE-46, w: i===2?46:36, h: i===2?46:36,
      dir:-1, startX:gx*TILE, range: i===2?26:20,
      alive:true, dying:false, dyingTimer:0, kind:spec.monsterKind, type:'gate', tier:i,
      hp: 55+i*30, maxHp: 55+i*30, attackCd:0,
      vx:0, vy:0, onGround:false, knockbackVx:0, knockbackTimer:0, knockbackCooldown:0,
      cleared:false,
      label: spec.gates[i].label, q: spec.gates[i].q, answer: spec.gates[i].answer
    }));

    player.x=64; player.y=200; player.vx=0; player.vy=0; player.invuln=60; player.attackTimer=0; player.attackCooldown=0;
    heartsUnits = MAX_HEART_UNITS; playerBar = BAR_MAX;
    correctCount=0; wrongCount=0;
    cameraX=0;
    document.getElementById('phaseTag').textContent = spec.name;
    updateHeartsHud(); updateBarHud();
  }

  function spawnCoinDrop(x,y,count){ for(let i=0;i<count;i++){ coins.push({x:x+ (i-count/2)*10, y:y-4-i*2, taken:false, phase:Math.random()*Math.PI*2}); } }
  function spawnHeartPickup(x,y){ pickups.push({x,y,type:'heart',taken:false,phase:0}); }
  function spawnKeyPickup(x,y){ pickups.push({x,y,type:'key',taken:false,phase:0}); }

  function damagePlayer(amount){
    playerBar -= amount;
    if(playerBar<=0){
      playerBar=0; heartsUnits -= 3; updateHeartsHud();
      if(heartsUnits<=0){ heartsUnits=0; updateHeartsHud(); gameOverFn(); return; }
      playerBar = BAR_MAX;
    }
    updateBarHud();
  }