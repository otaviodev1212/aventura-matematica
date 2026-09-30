
const PHASES = [
    {
      name:"Fase 1 · Floresta dos Conjuntos",
      subject:"Conjuntos e Conjuntos Numéricos",
      intro:"🌳 Entre na Floresta dos Conjuntos, onde cada caminho esconde desafios matemáticos. Enfrente slimes, resolva questões sobre conjuntos numéricos e descubra os segredos da união e interseção. Derrote o guardião da floresta e prove que domina a base da matemática.",
      monsterKind:'slime', treeKind:'pine',
      sky:['#000000','#00a6ff'], ground:'#000000', groundDark:'#2e7d32', dirt:'#7a4a24', accent:'#000602',
      hint:"Dica de Conjuntos: a União (∪) junta todos os elementos sem repetir; a Interseção (∩) pega só os elementos que aparecem nos dois conjuntos ao mesmo tempo.",
      questions:[
        {q:"Qual símbolo representa a união entre dois conjuntos?", opts:["∪","∩","⊂"], correct:0},
        {q:"Qual símbolo representa a interseção entre conjuntos?", opts:["∪","∩","="], correct:1},
        {q:"Qual conjunto representa os números naturais (0,1,2,3...)?", opts:["N","Z","Q"], correct:0},
        {q:"Qual conjunto contém números negativos, como -5?", opts:["N","Z","Irracionais"], correct:1},
        {q:"Se A = {1,2,3} e B = {2,3,4}, qual é A ∩ B?", opts:["{2,3}","{1,2,3,4}","{1,4}"], correct:0},
        {q:"Qual é a união de A = {1,2} e B = {3,4}?", opts:["{1,2}","{3,4}","{1,2,3,4}"], correct:2},
        {q:"O número 0,5 pertence a qual conjunto numérico?", opts:["Racionais (Q)","Naturais (N)","Irracionais"], correct:0},
        {q:"Quantos elementos tem o conjunto A = {2,4,6,8,10}?", opts:["5","4","6"], correct:0},
        {q:"O conjunto dos números irracionais inclui, por exemplo:", opts:["√2","1/2","3"], correct:0},
        {q:"A ⊂ B significa que:", opts:["A está contido em B","A é igual a B","A não tem elementos"], correct:0},
        {q:"O número 0,333... (dízima periódica) pertence a quais conjuntos numéricos?", opts:["Irracionais e Reais","Racionais e Reais","Naturais e Inteiros"],correct:1},
        {q:"Qual dos números abaixo pertence ao conjunto dos irracionais?", opts:["√3","0,75","-8"], correct:0},
        //{q:"Se A={1,2,3} e B={3,4,5}, qual é A ,2,3,4,5}","{3}","{4,5}"],correct:1},
        {q:"O conjunto dos números naturais é representado por:", opts:["N","Z","R"], correct:0},
        {q:"Um grupo possui 40 alunos. Desses, 25 gostam de Matemática, 18 gostam de Ciências e 10 gostam das duas matérias. Quantos alunos gostam de pelo menos uma das matérias?", opts:["33","43","28"], correct:0},
      ],
      gates:[
        {label:"Fácil", q:"Quantos elementos tem o conjunto A = {1,2,3}?", answer:"3"},
        {label:"Médio", q:"Se A = {1,2,3,4} e B = {3,4,5,6}, quantos elementos tem A ∪ B?", answer:"6"},
        {label:"Difícil", q:"Se A = {1,2,3,4,5} e B = {2,4,6,8}, quantos elementos tem A ∩ B?", answer:"2"},
        {label:"Fácil", q:"Considere A = {1,2,3,4,5,6,7} e B = {3,5,7,9,11}. Quantos elementos possui A ∪ B?", answer:"10"},
        {label:"Médio", q:"Em uma pesquisa com 50 alunos, 32 gostam de Matemática, 25 gostam de Física e 15 gostam das duas matérias. Quantos alunos não gostam de nenhuma das duas?",answer:"8"},
    {label:"Dificil", q:"Um conjunto A possui 20 elementos e um conjunto B possui 15 elementos. Sabendo que A ∩ B possui 8 elementos, quantos elementos possui A ∪ B?", answer:"27"}
      ]
    },
    {
      name:"Fase 2 · Deserto da Função Afim",
      subject:"Função do 1º Grau (Função Afim)",
      intro:"🏜️ Atravesse o perigoso Deserto da Função Afim, onde as dunas mudam conforme os valores de uma função. Enfrente criaturas do deserto, calcule raízes, descubra coeficientes e use seu conhecimento de f(x)=ax+b para abrir o caminho até a próxima aventura.",
      monsterKind:'bat', treeKind:'cactus',
      sky:['#ff9e5e','#ffd9a0'], ground:'#e0b34c', groundDark:'#b8892c', dirt:'#8a5a2c', accent:'#ff9e2c',
      hint:"Dica de Função Afim: em f(x) = ax + b, o 'a' é a inclinação da reta (coeficiente angular) e o 'b' é onde a reta corta o eixo y. Para achar a raiz, faça f(x) = 0 e isole o x.",
      questions:[
        {q:"Na função f(x) = 2x + 3, qual é o valor de f(2)?", opts:["7","5","4"], correct:0},
        {q:"Qual é o coeficiente angular de f(x) = -3x + 1?", opts:["1","-3","3"], correct:1},
        {q:"Em f(x) = x + 4, qual é a raiz da função?", opts:["4","-4","0"], correct:1},
        {q:"A função f(x) = 5x é crescente ou decrescente?", opts:["Crescente","Decrescente","Constante"], correct:0},
        {q:"Qual é o valor de f(0) em f(x) = 4x - 7?", opts:["7","4","-7"], correct:2},
        {q:"Qual é a lei de formação de uma função afim?", opts:["f(x)=ax+b","f(x)=ax²","f(x)=a/x"], correct:0},
        {q:"Se f(x) = -2x + 6, para que x temos f(x) = 0?", opts:["3","-3","6"], correct:0},
        {q:"O gráfico de uma função afim é sempre:", opts:["Uma reta","Uma parábola","Um círculo"], correct:0},
        {q:"Se f(x)= -x+10, qual é o valor de f(3)?", opts:["7","13","3"], correct:0},
        {q:"Qual é a raiz da função f(x)=2x-8?", opts:["2","4","8"], correct:1},
        {q:"Uma função afim tem coeficiente angular 3 e coeficiente linear 1. Qual é sua lei de formação?", opts:["f(x)=3x+1","f(x)=x+3","f(x)=3+x"], correct:0},
        {q:"Na função f(x) = 4x - 7, qual é o valor de x quando f(x) = 21?", opts:["5","7","8"],correct:1},
        {q:"A função f(x)=5x-15 possui raiz igual a:", opts:["2","3","5"], correct:1},
        {q:"Na função f(x)=7x-4, qual é o coeficiente angular?", opts:["7","-4","3"], correct:0},
        {q:"Na função f(x)=5x+2, qual é o valor de f(0)?", opts:["5","2","0"], correct:1},
        
      ],
      gates:[
        {label:"Fácil", q:"Calcule f(1) para f(x) = x + 2.", answer:"3"},
        {label:"Médio", q:"Calcule f(3) para f(x) = 2x - 1.", answer:"5"},
        {label:"Difícil", q:"Para f(x) = 3x - 2, qual o valor de x quando f(x) = 13?", answer:"5"},
        {label:"Médio", q:"Na função f(x)=5x-12, qual é o valor de x quando f(x)=38?", answer:"10"},
        {label:"Fácil", q:"A função f(x)=ax+4 possui f(3)=19. Qual é o valor do coeficiente angular a?", answer:"5"},
        {label:"Guardião da Função", q:"Uma função afim tem coeficiente angular a=4 e coeficiente linear b=6. Qual é o valor de f(5)?", answer:"26"}
      ]
    },
    {
      name:"Fase 3 · Caverna da Parábola",
      subject:"Função do 2º Grau (Função Quadrática)",
      intro:"🪨 Explore a Caverna da Parábola, um lugar cheio de mistérios e monstros de pedra. Para avançar, será necessário dominar funções quadráticas, calcular raízes, entender o delta e encontrar o ponto mais importante da parábola: o vértice.",
      monsterKind:'golem', treeKind:'stalag',
      sky:['#5b3b8c','#8b6bc9'], ground:'#8d8d99', groundDark:'#5a5a66', dirt:'#443f52', accent:'#c9a6ff',
      hint:"Dica de Função Quadrática: para calcular f(x) = ax² + bx + c num ponto, substitua o valor de x com cuidado no x² primeiro, depois some os termos com bx e c.",
      questions:[
        {q:"Qual é a forma geral de uma função do 2º grau?", opts:["ax + b","ax² + bx + c","a/x"], correct:1},
        {q:"Se a > 0, a parábola tem concavidade voltada para...", opts:["Cima","Baixo","Esquerda"], correct:0},
        {q:"Na função f(x) = x² - 4, quais são as raízes?", opts:["2 e -2","4 e -4","0 e 4"], correct:0},
        {q:"O valor de Δ (delta) é usado para encontrar...", opts:["As raízes da equação","Apenas o domínio","A concavidade"], correct:0},
        {q:"Calcule f(1) para f(x) = x² + 2x + 1", opts:["1","2","4"], correct:2},
        {q:"O vértice da parábola representa:", opts:["Ponto de máximo ou mínimo","Sempre a raiz","O eixo y"], correct:0},
        {q:"Se Δ > 0, a equação do 2º grau tem:", opts:["Duas raízes reais diferentes","Uma raiz real","Nenhuma raiz real"], correct:0},
        {q:"Na função f(x) = 2x², qual é o valor de f(3)?", opts:["18","6","9"], correct:0},
        {q:"Na função f(x)=4x-7, qual é o valor de x quando f(x)=17?", opts:["5","6","7"], correct:1},
        {q:"Se f(x)=-2x+14, qual é o valor de f(8)?", opts:["-2","2","-4"], correct:0},
        {q:"A função f(x)=3x+5 passa pelo ponto:", opts:["(2,11)","(3,11)","(1,8)"], correct:0},
        {q:"Qual é a raiz da função f(x)=6x-30?", opts:["4","5","6"], correct:1},
        {q:"Uma função afim possui coeficiente angular 5 e coeficiente linear -3. Qual é o valor de f(4)?", opts:["15","17","20"], correct:1},
        {q:"Sabendo que f(x)=ax+2 e f(3)=14, qual é o valor de a?", opts:["3","4","5"], correct:1},
        {q:"Se f(x)=2x-5, qual é o valor de x para que f(x)=21?", opts:["11","12","13"], correct:2}
      ],
      gates:[
        {label:"Fácil", q:"Calcule f(0) para f(x) = x² + 3.", answer:"3"},
        {label:"Médio", q:"Calcule f(2) para f(x) = x² - 3x + 2.", answer:"0"},
        {label:"Difícil", q:"Calcule f(3) para f(x) = 2x² - x - 1.", answer:"14"}
      ]
    },
    {
      name:"Fase 4 · Castelo da Trigonometria",
      subject:"Trigonometria no Triângulo Retângulo",
      intro:"🏰 Chegue ao Castelo da Trigonometria, o último desafio da jornada. Enfrente criaturas poderosas e resolva problemas envolvendo seno, cosseno, tangente e o Teorema de Pitágoras. Apenas quem dominar os triângulos conseguirá derrotar o dragão final e conquistar a vitória.",
      monsterKind:'dragon', treeKind:'tower',
      sky:['#2c2350','#6b4fa0'], ground:'#7a6a8c', groundDark:'#4a3d5c', dirt:'#3a2e47', accent:'#ff6b81',
      hint:"Dica de Trigonometria: no Teorema de Pitágoras, hipotenusa² = cateto1² + cateto2². Para achar um cateto, subtraia os quadrados e tire a raiz quadrada.",
      questions:[
        {q:"O seno de um ângulo é a razão entre...", opts:["Cateto oposto e hipotenusa","Cateto adjacente e hipotenusa","Os dois catetos"], correct:0},
        {q:"O valor de sen(30°) é aproximadamente:", opts:["0,5","1","0,87"], correct:0},
        {q:"Cosseno é a razão entre...", opts:["Cateto adjacente e hipotenusa","Cateto oposto e hipotenusa","Os dois catetos"], correct:0},
        {q:"Um triângulo retângulo tem catetos 8 e 15. Qual é a hipotenusa?", opts:["17","16","18"], correct:0},
        {q:"tan(45°) é igual a:", opts:["1","0","0,5"], correct:0},
        {q:"A soma dos ângulos internos de um triângulo é:", opts:["180°","360°","90°"], correct:0},
        {q:"A tangente é a razão entre:", opts:["Cateto oposto e cateto adjacente","Cateto oposto e hipotenusa","Cateto adjacente e hipotenusa"], correct:0},
        {q:"Qual é o valor de cos(0°)?", opts:["1","0","0,5"], correct:0},
        {q:"Um triângulo retângulo tem catetos 5 e 12. Qual é a hipotenusa?", opts:["13","15","17"], correct:0},
        {q:"Qual é o valor de sen(90°)?", opts:["1","0","0,5"], correct:0},
        {q:"Qual é o valor de cos(60°)?", opts:["0,5","1","0"], correct:0},
        {q:"Qual é o valor de tan(45°)?", opts:["1","0,5","2"], correct:0},
        {q:"Um triângulo retângulo tem hipotenusa 10 e um cateto 6. Qual é o outro cateto?", opts:["8","7","9"], correct:0},
        {q:"No triângulo retângulo, o seno é a razão entre:", opts:["Cateto oposto e hipotenusa","Cateto adjacente e hipotenusa","Os dois catetos"], correct:0},
        {q:"A soma dos ângulos internos de qualquer triângulo é:", opts:["180°","90°","360°"], correct:0},
      ],
      gates:[
        {label:"Fácil", q:"Um triângulo retângulo tem catetos 3 e 4. Qual é a hipotenusa?", answer:"5"},
        {label:"Médio", q:"Um triângulo retângulo tem catetos 6 e 8. Qual é a hipotenusa?", answer:"10"},
        {label:"Difícil", q:"Um triângulo retângulo tem hipotenusa 13 e um cateto 5. Qual é o outro cateto?", answer:"12"}
      ]
    }
  ];