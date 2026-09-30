
function spawnParticles(x,y,color){ for(let i=0;i<10;i++){ particles.push({ x,y, vx:(Math.random()-0.5)*4, vy:-Math.random()*4-1, life:30, color }); } }
  function updateParticles(){ for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life--; if(p.life<=0) particles.splice(i,1); } }

  function rectsOverlap(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
  function moveAndCollide(entity){
    entity.x += entity.vx;
    for(const b of blocks){
      if(!isSolid(b)) continue;
      const bb={x:b.x,y:b.y,w:TILE,h:TILE};
      if(rectsOverlap(entity,bb)){
        if(entity.vx>0) entity.x=bb.x-entity.w; else if(entity.vx<0) entity.x=bb.x+bb.w;
        entity.vx=0;
      }
    }
    entity.y += entity.vy;
    const wasFalling = entity.vy>3;
    entity.onGround=false;
    for(const b of blocks){
      if(!isSolid(b)) continue;
      const bb={x:b.x,y:b.y,w:TILE,h:TILE};
      if(rectsOverlap(entity,bb)){
        if(entity.vy>0){
          entity.y=bb.y-entity.h; entity.vy=0; entity.onGround=true;
          if(wasFalling && entity===player) landTimer=6;
        } else if(entity.vy<0){
          entity.y=bb.y+bb.h; entity.vy=0;
          if(b.type==='mystery' && !b.used){
            b.used=true; b.bump=6; score+=50; coinCount++; sfx.coin();
            spawnParticles(bb.x+16, bb.y, '#ffd700');
          } else if(b.type==='mystery' || b.type==='brick'){ b.bump=6; }
        }
      }
    }
    if(entity.y > H_ROWS*TILE + 80) return true;
    return false;
  }

  function startDeath(entity, onComplete){
    entity.dying = true; entity.dyingTimer = DEATH_ANIM_FRAMES;
    sfx.death();
    spawnParticles(entity.x+entity.w/2, entity.y+entity.h/2, '#ffb347');
    dyingList.push({entity, onComplete});
  }
  function finishMonsterDeath(m){
    spawnCoinDrop(m.x+m.w/2, m.y+m.h/2, 2);
    playerBar = BAR_MAX; updateBarHud();
    openQuiz(m);
  }
  function finishChestBossDeath(m){
    spawnKeyPickup(m.x+m.w/2, m.y+m.h/2);
    playerBar = BAR_MAX; updateBarHud();
    sfx.key();
  }
  function finishGateDeath(g){
    spawnCoinDrop(g.x+g.w/2, g.y+g.h/2, 3);
    playerBar = BAR_MAX; updateBarHud();
    openGate(g);
  }
  function handleBarrelBreak(b){
    b.alive=false; sfx.breakSfx();
    spawnParticles(b.x+b.w/2, b.y+b.h/2, '#c98a4b');
    if(b.willDropHeart) spawnHeartPickup(b.x+b.w/2, b.y+b.h/2);
    else spawnCoinDrop(b.x+b.w/2, b.y+b.h/2, 1);
  }