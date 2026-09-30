
const LAYOUT = {
    width:200,
    pits:[
      [25,26],
      [55,56],
      [85,86],
      [115,116],
      [150,151],
      [180,181]
      ],

    platforms:[
      [12,13,3,'brick'],
      [30,12,3,'brick'],
      [46,14,2,'brick'],
      [49,12,2,'brick'],
      [52,10,5,'brick'],
      [72,12,3,'brick'],
      [90,13,4,'brick'],
      [108,11,3,'brick'],
      [125,13,5,'brick'],
      [140,10,4,'brick']
    ],

    mystery:[
      [13,13],
      [31,12],
      [73,12],
      [110,11],
      [140,10]
    ],

    coins:[
      [6,14],[7,14],[8,14],
      [23,14],[24,14],[25,14],
      [42,12],[43,12],
      [53,10],[54,10],[55,10],
      [76,12],[77,12],
      [88,14],[89,14],
      [100,14],[101,14],[102,14],
      [120,12],[121,12],
      [140,14],[141,14],[142,14]
    ],

    monstersX:[
    10,
    22,
    35,
    50,
    65,
    80,
    95,
    110,
    125,
    140,
    155,
    170,
    180,
    185
    ],

    chestMinibossTileX:56,
    chestTileX:57,
    mageTileX:[
      35,
      85,
      125,
      165
      ],
    barrelsX:[
      16,36,66,80,
      100,118,138
    ],
    gateXTiles:[
    40,
    80,
    110,
    140,
    165,
    195
    ]
};

  function buildRows(spec){
    const W = spec.width;
    const grid = [];
    for(let y=0;y<H_ROWS;y++) grid.push(new Array(W).fill(' '));
    for(let x=0;x<W;x++){
      const inPit = spec.pits.some(([a,b])=>x>=a && x<=b);
      if(!inPit){ grid[GROUND_ROW][x]='#'; grid[GROUND_ROW+1][x]='#'; }
    }
    (spec.platforms||[]).forEach(([x,y,len,ch])=>{
      for(let i=0;i<len;i++){ if(x+i<W) grid[y][x+i]=ch; }
    });
    (spec.mystery||[]).forEach(([x,y])=>{ if(x<W) grid[y][x]='?'; });
    (spec.coins||[]).forEach(([x,y])=>{ if(x<W) grid[y][x]='C'; });
    grid[GROUND_ROW-1][W-4]='F';
    return grid.map(r=>r.join(''));
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function pseudoRand(seed){ const x = Math.sin(seed*12.9898)*43758.5453; return x-Math.floor(x); }