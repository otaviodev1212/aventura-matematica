function update(){
    if(uiMode!=='playing'){
      const gp = pollGamepad();
      if(gp){
        // Converte o direcional/analógico nos mesmos eventos de direção usados pelo teclado.
        if(gpDirectionEdge(gp,'up')) onDirPress('arrowup');
        if(gpDirectionEdge(gp,'down')) onDirPress('arrowdown');
        if(gpDirectionEdge(gp,'left')) onDirPress('arrowleft');
        if(gpDirectionEdge(gp,'right')) onDirPress('arrowright');
        // Botão inferior confirma (A/✕); o botão direito volta (B/○).
        if(gpEdge(gp,GP_BUTTON.CONFIRM)) onConfirmPress();
        if(gpEdge(gp,GP_BUTTON.BACK)) onBackPress();
        rememberGamepadState(gp);
      } else rememberGamepadState(null);
      attackQueued=false; interactQueued=false;
      return;
    }
    if(!started) return;
    time++;
    if(landTimer>0) landTimer--;
    if(mageCooldown>0) mageCooldown--;

    // death animations tick (always, even mid-combat)
    for(let i=dyingList.length-1;i>=0;i--){
      const d = dyingList[i];
      d.entity.dyingTimer--;
      if(Math.random()<0.35) spawnParticles(d.entity.x+d.entity.w/2, d.entity.y+d.entity.h/2, '#ffffff');
      if(d.entity.dyingTimer<=0){
        d.entity.alive=false; d.entity.dying=false;
        d.onComplete();
        dyingList.splice(i,1);
      }
    }

    let left=keys['arrowleft']||keys['a'];
    let right=keys['arrowright']||keys['d'];
    let jump=keys['arrowup']||keys['w']||keys[' '];

    const gp = pollGamepad();
    if(gp){
      // Movimento contínuo: analógico esquerdo ou D-pad, como ←/→ no teclado.
      if(gpDirectionHeld(gp,'left')) left=true;
      if(gpDirectionHeld(gp,'right')) right=true;
      // Cima/D-pad ou botão inferior (A/✕) pula durante a fase.
      if(gpDirectionHeld(gp,'up') || gpButtonHeld(gp,GP_BUTTON.CONFIRM)) jump=true;
      // Ataque aceita X/□ e os gatilhos L2/LT ou R2/RT, conforme o controle.
      if(gpButtonHeld(gp,GP_BUTTON.ATTACK_ALT) || gpButtonHeld(gp,GP_BUTTON.LEFT_TRIGGER) || gpButtonHeld(gp,GP_BUTTON.RIGHT_TRIGGER)) attackQueued=true;
      if(gpEdge(gp,GP_BUTTON.INTERACT)) onInteractPress(); // △/Y: interagir com o mago.
      if(gpEdge(gp,GP_BUTTON.BACK)) onBackPress(); // ○/B: voltar ao mapa durante a fase.
      rememberGamepadState(gp);
    } else rememberGamepadState(null);
    if(interactQueued && nearMage){ openMage(); }
    interactQueued=false;

    if(left){ player.vx=-MOVE_SPEED; player.facing=-1; }
    else if(right){ player.vx=MOVE_SPEED; player.facing=1; }
    else player.vx=0;

    if(jump && player.onGround){ player.vy=JUMP_V; player.onGround=false; sfx.jump(); }

    if(player.attackCooldown>0) player.attackCooldown--;
    if(player.attackTimer>0) player.attackTimer--;
    if(attackQueued && player.attackCooldown<=0){
      player.attackTimer = ATTACK_DURATION; player.attackCooldown = ATTACK_COOLDOWN;
      sfx.swing();
      const atkW=30, atkH=32;
      const atkX = player.facing>0 ? player.x+player.w-4 : player.x-atkW+4;
      const atkBox = {x:atkX, y:player.y-2, w:atkW, h:atkH};
      const targets = monsters.filter(m=>m.alive && !m.dying)
        .concat(barrels.filter(b=>b.alive))
        .concat(gates.filter(g=>g.alive && !g.dying && !g.cleared));
      for(const m of targets){
        const mb={x:m.x,y:m.y,w:m.w,h:m.h};
        if(rectsOverlap(atkBox,mb)){
          if(barrels.includes(m)){ handleBarrelBreak(m); continue; }
          m.hp -= ATTACK_DAMAGE;
          sfx.monsterHit();
          spawnParticles(m.x+m.w/2, m.y+m.h/2, '#ffffff');
          // O golpe injeta velocidade horizontal e inicia uma pausa de 1 s.
          // Novos golpes durante a pausa causam dano, mas não reiniciam o
          // relógio, garantindo que a patrulha sempre volte.
          if(m.knockbackCooldown<=0){
            m.knockbackVx = player.facing*KNOCKBACK_SPEED;
            m.knockbackTimer = KNOCKBACK_FRAMES;
            m.knockbackCooldown = KNOCKBACK_COOLDOWN_FRAMES;
          }
          if(m.hp<=0 && !m.dying){
            if(m.type==='gate') startDeath(m, ()=>finishGateDeath(m));
            else startDeath(m, ()=>finishMonsterDeath(m));
          }
        }
      }
    }
    attackQueued=false;

    player.vy += GRAVITY;
    if(player.vy>MAX_FALL) player.vy=MAX_FALL;
    const fell = moveAndCollide(player);
    if(fell){
      damagePlayer(BAR_MAX+1);
      if(heartsUnits<=0) return;
      player.x=64; player.y=200; player.vx=0; player.vy=0; player.invuln=INVULN_FRAMES;
      return;
    }
    if(player.x<0) player.x=0;
    if(player.invuln>0) player.invuln--;

    for(const b of blocks) if(b.bump>0) b.bump--;

    for(const c of coins){
      if(c.taken) continue;
      c.phase += 0.15;
      const cb={x:c.x-8,y:c.y-8,w:16,h:16};
      if(rectsOverlap(player,cb)){ c.taken=true; coinCount++; score+=10; sfx.coin(); spawnParticles(c.x,c.y,'#ffd700'); }
    }
    for(const p of pickups){
      if(p.taken) continue;
      const pb={x:p.x-8,y:p.y-8,w:16,h:16};
      if(rectsOverlap(player,pb)){
        p.taken=true;
        if(p.type==='heart'){ heartsUnits=Math.min(MAX_HEART_UNITS,heartsUnits+2); sfx.heart(); updateHeartsHud(); spawnParticles(p.x,p.y,'#ff6b81'); }
        else if(p.type==='key'){ hasKey=true; sfx.key(); spawnParticles(p.x,p.y,'#ffd23f'); }
      }
    }

    const activeMobs = monsters.filter(m=>m.alive && !m.dying)
      .concat(gates.filter(g=>g.alive && !g.dying && !g.cleared));
    for(const m of activeMobs){
      if(m.knockbackCooldown>0) m.knockbackCooldown--;
      if(m.knockbackTimer>0){
        m.vx = m.knockbackVx;
        m.knockbackVx *= KNOCKBACK_DECELERATION;
        m.knockbackTimer--;
        if(Math.abs(m.knockbackVx)<0.5) m.knockbackVx=0;
      } else {
        // O cooldown só impede uma nova repulsão. A patrulha continua para
        // que o inimigo nunca fique congelado depois de ser atingido.
        m.vx = m.dir*(m.type==='gate'&&m.tier===2?0.5:1.0);
      }
      m.vy += GRAVITY;
      if(m.vy>MAX_FALL) m.vy=MAX_FALL;
      // Inimigos usam a mesma colisão vertical do jogador: assim caminham
      // sobre o chão, caem quando a plataforma termina e batem em paredes.
      const intendedVx = m.vx;
      if(moveAndCollide(m)){
        m.alive=false;
        spawnParticles(m.x+m.w/2,m.y+m.h/2,'#ffb347');
        continue;
      }
      if(intendedVx!==0 && m.vx===0){
        if(m.knockbackTimer>0){
          m.knockbackTimer=0;
          m.knockbackVx=0;
        } else if(m.knockbackCooldown<=0) m.dir*=-1;
      }
      if(m.knockbackTimer<=0 && (m.x < m.startX-m.range || m.x > m.startX+m.range)) m.dir*=-1;
      if(m.attackCd>0) m.attackCd--;
      const meleeBox = {x:m.x-6,y:m.y-6,w:m.w+12,h:m.h+12};
      if(player.invuln<=0 && m.attackCd<=0 && rectsOverlap(player,meleeBox)){
        damagePlayer(BAR_DAMAGE);
        player.invuln = INVULN_FRAMES;
        player.vx = (player.x < m.x ? -1 : 1)*5;
        m.attackCd = MONSTER_ATK_COOLDOWN;
        if(heartsUnits<=0) return;
      }
    }
    for(const g of gates){ if(!g.cleared && player.x > g.x-14){ player.x = g.x-40; } }

    const mageBox={x:mage.x-10,y:mage.y-10,w:mage.w+20,h:mage.h+20};
    nearMage = rectsOverlap(player,mageBox) && mageCooldown<=0;

    if(flagX!==null && player.x > flagX-14){
      const lastGate = gates[gates.length-1];
      if(!lastGate.cleared){ player.x = flagX-40; }
      else { completePhase(); return; }
    }

    updateParticles();
    const levelPxW = LAYOUT.width*TILE;
    const targetCam = player.x - canvas.width*0.35;
    cameraX = Math.max(0, Math.min(targetCam, Math.max(0, levelPxW-canvas.width)));

    scoreHud.textContent='PONTOS: '+score;
    coinsHud.textContent='🪙 x'+coinCount + (hasKey?'  🔑':'');
  }