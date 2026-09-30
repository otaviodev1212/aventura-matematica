render
function drawBackground(spec){
    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0, spec.sky[0]); grad.addColorStop(1, spec.sky[1]);
    ctx.fillStyle = grad; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for(let i=-1;i<8;i++){ const cx=(i*220-(cameraX*0.35)%220); drawCloud(cx+60, 40+(i%3)*16); }
    drawTrees(spec);
  }
  function drawCloud(x,y){
    ctx.beginPath();
    ctx.ellipse(x,y,20,14,0,0,Math.PI*2);
    ctx.ellipse(x+18,y-6,16,12,0,0,Math.PI*2);
    ctx.ellipse(x-18,y-4,14,11,0,0,Math.PI*2);
    ctx.fill();
  }
  function drawTrees(spec){
    const kind = spec.treeKind;
    for(let i=-1;i<10;i++){
      const bx = (i*95-(cameraX*0.55)%95);
      const groundY = GROUND_ROW*TILE;
      if(kind==='pine'){
        ctx.fillStyle='rgba(20,60,20,0.55)';
        ctx.beginPath(); ctx.moveTo(bx,groundY); ctx.lineTo(bx+16,groundY-55); ctx.lineTo(bx+32,groundY); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(bx+4,groundY-20); ctx.lineTo(bx+16,groundY-70); ctx.lineTo(bx+28,groundY-20); ctx.closePath(); ctx.fill();
      } else if(kind==='cactus'){
        ctx.fillStyle='rgba(30,90,40,0.5)';
        ctx.fillRect(bx+10,groundY-50,10,50);
        ctx.fillRect(bx-2,groundY-32,10,10); ctx.fillRect(bx-2,groundY-42,6,20);
        ctx.fillRect(bx+22,groundY-38,10,10); ctx.fillRect(bx+26,groundY-48,6,20);
      } else if(kind==='stalag'){
        ctx.fillStyle='rgba(40,25,55,0.55)';
        ctx.beginPath(); ctx.moveTo(bx,groundY); ctx.lineTo(bx+10,groundY-60); ctx.lineTo(bx+20,groundY); ctx.closePath(); ctx.fill();
      } else if(kind==='tower'){
        ctx.fillStyle='rgba(30,20,45,0.5)';
        ctx.fillRect(bx,groundY-70,22,70);
        ctx.beginPath(); ctx.moveTo(bx-3,groundY-70); ctx.lineTo(bx+11,groundY-95); ctx.lineTo(bx+25,groundY-70); ctx.closePath(); ctx.fill();
      }
    }
  }

  function drawBlock(b, spec){
    const sx=b.x-cameraX, sy=b.y+(b.bump>0?-b.bump:0);
    if(sx<-TILE||sx>canvas.width) return;
    if(b.type==='ground'){
      const g = ctx.createLinearGradient(sx,sy,sx,sy+TILE);
      g.addColorStop(0, spec.dirt); g.addColorStop(0.55,'#00000030'); g.addColorStop(1,'#00000060');
      ctx.fillStyle=g; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle=spec.ground; ctx.fillRect(sx,sy,TILE,8);
      ctx.fillStyle=spec.groundDark; ctx.fillRect(sx,sy+8,TILE,2);
      const r1 = pseudoRand(b.x*0.31), r2 = pseudoRand(b.x*0.77+5);
      ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(sx+4+r1*10, sy+2, 3, 3);
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(sx+6+r2*18, sy+16, 4, 4); ctx.fillRect(sx+2+r1*20, sy+24, 3, 3);
      // preenche solido ate o fundo da tela, pra nao parecer que o chao flutua
      const fillBelow = canvas.height-(sy+TILE);
      if(fillBelow>0){ ctx.fillStyle=spec.dirt; ctx.fillRect(sx, sy+TILE, TILE, fillBelow); }
    } else if(b.type==='brick'){
      const g = ctx.createLinearGradient(sx,sy,sx,sy+TILE);
      g.addColorStop(0,'#d1691f'); g.addColorStop(1,'#8a3d0c');
      ctx.fillStyle=g; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.strokeStyle='#5c2606'; ctx.lineWidth=2;
      ctx.strokeRect(sx+1,sy+1,TILE-2,TILE/2-1);
      ctx.strokeRect(sx+1,sy+TILE/2,TILE/2-1,TILE/2-1);
      ctx.strokeRect(sx+TILE/2,sy+TILE/2,TILE/2-1,TILE/2-1);
    } else if(b.type==='mystery'){
      const g = ctx.createLinearGradient(sx,sy,sx,sy+TILE);
      if(b.used){ g.addColorStop(0,'#a08a5e'); g.addColorStop(1,'#6b5a3a'); } else { g.addColorStop(0,'#ffe066'); g.addColorStop(1,'#ffa500'); }
      ctx.fillStyle=g; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.strokeStyle='#7a5200'; ctx.lineWidth=2; ctx.strokeRect(sx+1,sy+1,TILE-2,TILE-2);
      if(!b.used){ ctx.fillStyle='#7a5200'; ctx.font='bold 18px monospace'; ctx.textAlign='center'; ctx.fillText('?', sx+TILE/2, sy+TILE/2+7); }
    }
  }

  function drawCoin(c){
    if(c.taken) return;
    const sx=c.x-cameraX; if(sx<-20||sx>canvas.width+20) return;
    const squish=Math.abs(Math.cos(c.phase));
    ctx.save(); ctx.translate(sx,c.y); ctx.scale(Math.max(0.15,squish),1);
    const g = ctx.createRadialGradient(0,0,1,0,0,8); g.addColorStop(0,'#fff7c2'); g.addColorStop(1,'#ffd700');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#b8860b'; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
  }
  function drawPickup(p){
    if(p.taken) return;
    const sx=p.x-cameraX; if(sx<-20||sx>canvas.width+20) return;
    p.phase += 0.1;
    const bob = Math.sin(p.phase)*3;
    ctx.font='16px monospace'; ctx.textAlign='center';
    ctx.fillText(p.type==='heart'?'❤️':'🔑', sx, p.y+bob);
  }
  function drawShadow(x,y,w){ ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x,y,w,5,0,0,Math.PI*2); ctx.fill(); }
  function drawHpBar(sx, topY, w, hp, maxHp){
    ctx.fillStyle='#000'; ctx.fillRect(sx-1, topY-1, w+2, 7);
    ctx.fillStyle='#3a2a2a'; ctx.fillRect(sx, topY, w, 5);
    const frac = Math.max(0,hp/maxHp);
    ctx.fillStyle = frac>0.5 ? '#2ecc71' : (frac>0.25 ? '#ffd23f' : '#e63946');
    ctx.fillRect(sx, topY, w*frac, 5);
  }

  function drawMonsterShape(kind, w, h, tint){
    if(kind==='slime'){
      const g = ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'#7CFC7C'); g.addColorStop(1,'#2e8b3d');
      ctx.fillStyle = tint || g;
      ctx.beginPath(); ctx.moveTo(0,h); ctx.quadraticCurveTo(0,-h*0.2, w/2, -h*0.2); ctx.quadraticCurveTo(w, -h*0.2, w, h); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(w*0.32,h*0.35,4,0,Math.PI*2); ctx.arc(w*0.68,h*0.35,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(w*0.32,h*0.35,2,0,Math.PI*2); ctx.arc(w*0.68,h*0.35,2,0,Math.PI*2); ctx.fill();
    } else if(kind==='bat'){
      ctx.fillStyle= tint || '#6b3fa0';
      ctx.beginPath(); ctx.ellipse(w/2,h/2,w*0.28,h*0.35,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.2,h*0.4); ctx.lineTo(-w*0.5,h*0.1); ctx.lineTo(-w*0.1,h*0.6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.8,h*0.4); ctx.lineTo(w*1.5,h*0.1); ctx.lineTo(w*1.1,h*0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(w*0.4,h*0.42,3,0,Math.PI*2); ctx.arc(w*0.6,h*0.42,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#e63946'; ctx.beginPath(); ctx.arc(w*0.4,h*0.42,1.4,0,Math.PI*2); ctx.arc(w*0.6,h*0.42,1.4,0,Math.PI*2); ctx.fill();
    } else if(kind==='golem'){
      ctx.fillStyle= tint || '#8d8d99';
      ctx.fillRect(0,h*0.15,w,h*0.85);
      ctx.fillStyle='#6b6b78'; ctx.fillRect(2,h*0.15,w-4,6); ctx.fillRect(2,h*0.5,w-4,6);
      ctx.fillStyle='#3a3a44'; ctx.beginPath(); ctx.arc(w*0.32,h*0.32,4,0,Math.PI*2); ctx.arc(w*0.68,h*0.32,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ff5555'; ctx.beginPath(); ctx.arc(w*0.32,h*0.32,2,0,Math.PI*2); ctx.arc(w*0.68,h*0.32,2,0,Math.PI*2); ctx.fill();
    } else if(kind==='dragon'){
      ctx.fillStyle= tint || '#d94f63';
      ctx.beginPath(); ctx.ellipse(w/2,h*0.55,w*0.42,h*0.4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.15,h*0.4); ctx.lineTo(-w*0.6,-h*0.1); ctx.lineTo(w*0.05,h*0.15); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w*0.85,h*0.4); ctx.lineTo(w*1.6,-h*0.1); ctx.lineTo(w*0.95,h*0.15); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(w*0.5,h*0.15,w*0.22,h*0.18,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffe066'; ctx.beginPath(); ctx.arc(w*0.42,h*0.13,3,0,Math.PI*2); ctx.arc(w*0.58,h*0.13,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(w*0.42,h*0.13,1.4,0,Math.PI*2); ctx.arc(w*0.58,h*0.13,1.4,0,Math.PI*2); ctx.fill();
    }
  }

  function drawMonster(m, spec){
    if(!m.alive && !m.dying) return;
    const sx=m.x-cameraX; if(sx<-70||sx>canvas.width+70) return;
    const w=m.w, h=m.h;
    if(m.dying){
      const frac = Math.max(0, m.dyingTimer/DEATH_ANIM_FRAMES);
      ctx.save();
      ctx.globalAlpha = frac;
      ctx.translate(sx+w/2, m.y+h);
      ctx.rotate((1-frac)*0.8*(m.dir||1));
      ctx.scale(frac, frac);
      ctx.translate(-w/2, -h);
      drawMonsterShape(m.kind, w, h, null);
      ctx.restore();
      return;
    }
    drawShadow(sx+w/2, m.y+h+2, w*0.5);
    drawHpBar(sx-2, m.y-14, w+4, m.hp, m.maxHp);
    let label=null;
    if(m.type==='chestboss') label='GUARDIÃO DO BAÚ';
    else if(m.type==='gate') label='PORTÃO '+m.label.toUpperCase();
    if(label){ ctx.fillStyle=spec.accent; ctx.font='bold 9px monospace'; ctx.textAlign='center'; ctx.fillText(label, sx+w/2, m.y-18); }
    ctx.save(); ctx.translate(sx,m.y);
    const bob = Math.sin(time*0.1 + m.x*0.05)*2; ctx.translate(0,bob);
    const tint = m.type!=='normal' ? (m.type==='gate'&&m.tier===2 ? '#7a1a2a' : '#5a2a5a') : null;
    drawMonsterShape(m.kind, w, h, tint);
    ctx.restore();
  }

  function drawBarrel(b){
    if(!b.alive) return;
    const sx=b.x-cameraX; if(sx<-40||sx>canvas.width+40) return;
    drawShadow(sx+b.w/2, b.y+b.h+2, b.w*0.5);
    const g = ctx.createLinearGradient(sx,b.y,sx,b.y+b.h);
    g.addColorStop(0,'#c98a4b'); g.addColorStop(1,'#7a4a24');
    ctx.fillStyle=g; ctx.fillRect(sx,b.y,b.w,b.h);
    ctx.strokeStyle='#3a2410'; ctx.lineWidth=2; ctx.strokeRect(sx,b.y,b.w,b.h);
    ctx.beginPath(); ctx.moveTo(sx,b.y+7); ctx.lineTo(sx+b.w,b.y+7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx,b.y+b.h-7); ctx.lineTo(sx+b.w,b.y+b.h-7); ctx.stroke();
  }

  function drawMage(){
    const sx=mage.x-cameraX; if(sx<-40||sx>canvas.width+40) return;
    drawShadow(sx+mage.w/2, mage.y+mage.h+2, mage.w*0.5);
    ctx.fillStyle='#4a2a7a'; ctx.fillRect(sx+4,mage.y+10,mage.w-8,mage.h-10);
    ctx.fillStyle='#f1c27d'; ctx.beginPath(); ctx.arc(sx+mage.w/2,mage.y+8,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#6b3fa0'; ctx.beginPath();
    ctx.moveTo(sx+mage.w/2-10,mage.y+2); ctx.lineTo(sx+mage.w/2+10,mage.y+2); ctx.lineTo(sx+mage.w/2,mage.y-14); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#3a2050'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(sx+mage.w+2,mage.y); ctx.lineTo(sx+mage.w+2,mage.y+mage.h); ctx.stroke();
    ctx.fillStyle='#ffd23f'; ctx.beginPath(); ctx.arc(sx+mage.w+2,mage.y-2,4,0,Math.PI*2); ctx.fill();
    if(nearMage){
      const bob = Math.sin(time*0.15)*3;
      ctx.fillStyle='#ffd23f'; ctx.font='bold 14px monospace'; ctx.textAlign='center';
      ctx.fillText('▲', sx+mage.w/2, mage.y-24+bob);
      ctx.font='9px monospace'; ctx.fillStyle='#fff';
      ctx.fillText('Interagir', sx+mage.w/2, mage.y-34+bob);
    }
  }

  function drawFlag(){
    if(flagX===null) return;
    const sx=flagX-cameraX; if(sx<-30||sx>canvas.width+30) return;
    const poleTop = (GROUND_ROW-1)*TILE - 60;
    ctx.fillStyle='#c0c0c0'; ctx.fillRect(sx+14, poleTop, 4, (GROUND_ROW+1)*TILE-poleTop);
    const lastGate = gates[gates.length-1];
    ctx.fillStyle = (lastGate&&lastGate.cleared) ? '#2ecc71' : '#888';
    ctx.beginPath(); ctx.moveTo(sx+18, poleTop+8); ctx.lineTo(sx+46, poleTop+20); ctx.lineTo(sx+18, poleTop+32); ctx.closePath(); ctx.fill();
  }

  function drawSword(){
    if(player.attackTimer<=0) return;
    const sx=player.x-cameraX, sy=player.y;
    const t = 1 - player.attackTimer/ATTACK_DURATION;
    const angle = (t-0.5)*1.2;
    ctx.save(); ctx.translate(sx+player.w/2, sy+14); ctx.scale(player.facing,1); ctx.rotate(angle);
    ctx.fillStyle='#cfd8dc'; ctx.fillRect(8,-3,26,6);
    ctx.fillStyle='#7a5c2e'; ctx.fillRect(2,-4,8,8);
    ctx.restore();
  }

  function drawPlayer(){
    const sx=player.x-cameraX, sy=player.y;
    if(player.invuln>0 && Math.floor(time/4)%2===0) return;
    const squish = landTimer>0 ? 1-landTimer*0.02 : 1;
    drawSword();
    ctx.save();
    ctx.translate(sx+player.w/2, sy+player.h*(1-squish));
    ctx.scale(player.facing, squish);
    const walking = Math.abs(player.vx)>0.1 && player.onGround;
    const legFrame = walking ? Math.floor(time/6)%2 : 0;
    ctx.fillStyle='#2255cc';
    if(legFrame===0){ ctx.fillRect(-player.w/2+2, 20, 8, 10); ctx.fillRect(player.w/2-10, 20, 8, 10); }
    else { ctx.fillRect(-player.w/2+2, 22, 8, 8); ctx.fillRect(player.w/2-10, 18, 8, 12); }
    ctx.fillStyle='#2255cc'; ctx.fillRect(-player.w/2, 12, player.w, 12);
    ctx.fillStyle='#e63946'; ctx.fillRect(-player.w/2, 6, player.w, 8);
    ctx.fillRect(-player.w/2-3, 10, 5, 10); ctx.fillRect(player.w/2-2, 10, 5, 10);
    ctx.fillStyle='#f1c27d'; ctx.fillRect(-player.w/2+3, -6, player.w-6, 12);
    ctx.fillStyle='#e63946'; ctx.fillRect(-player.w/2+1, -10, player.w-2, 6); ctx.fillRect(2, -6, 8, 3);
    ctx.fillStyle='#4a2c17'; ctx.fillRect(-2, 0, 8, 3);
    ctx.restore();
  }

  function drawParticles(){
    for(const p of particles){
      const sx = p.x-cameraX;
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0,p.life/30);
      ctx.beginPath(); ctx.arc(sx,p.y,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    }
  }

  function drawMenuScene(idx){
    const spec = PHASES[idx] || PHASES[0];
    drawBackground(spec);
    ctx.fillStyle=spec.dirt; ctx.fillRect(0,GROUND_ROW*TILE,canvas.width,canvas.height-GROUND_ROW*TILE);
    ctx.fillStyle=spec.ground; ctx.fillRect(0,GROUND_ROW*TILE,canvas.width,8);
  }

  function drawScene(){
    const spec = PHASES[phaseIdx];
    drawBackground(spec);
    for(const b of blocks) drawBlock(b, spec);
    for(const c of coins) drawCoin(c);
    for(const p of pickups) drawPickup(p);
    drawMage();
    drawFlag();
    for(const b of barrels) drawBarrel(b);
    for(const m of monsters) drawMonster(m, spec);
    for(const g of gates) drawMonster(g, spec);
    drawPlayer();
    drawParticles();
  }