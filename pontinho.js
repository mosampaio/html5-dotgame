function isIe() {
	return 'Microsoft Internet Explorer' == navigator.appName;
}
//classe Ponto
var Ponto = Class.create();
Ponto.prototype = {
	initialize: function(x, y) {
		this.setX(x);
		this.setY(y);
	},
	setX: function(x) {
		this.x = x;
	},
	setY: function(y) {
		this.y = y;
	}
}
//classe linha
var Linha = Class.create();
Linha.prototype = {
	initialize: function(p1, p2) {
		this.setP1(p1);
		this.setP2(p2);
	},
	setP1: function(p1) {
		this.p1 = p1;
	},
	setP2: function(p2) {
		this.p2 = p2;
	},
	setMarcada: function(marcada) {
		this.marcada = marcada;
	}
}
//classe Quadrado
var Quadrado = Class.create();
Quadrado.prototype = {
	initialize: function(pontos, linhas) {
		this.setPontos(pontos);
		this.setLinhas(linhas);
	},
	setPontos: function(pontos) {
		this.pontos = pontos;
	},
	setLinhas: function(linhas) {
		this.linhas = linhas;
	},
	setJogador: function(jogador) {
		this.jogador = jogador;
	}
}

var Jogador = Class.create();
Jogador.prototype = {
	initialize: function(flgJogador, cor, corLinha) {
		this.setFlgJogador(flgJogador);
		this.setCor(cor);
		this.setCorLinha(corLinha);
		this.setPontuacao(0);
	},
	setFlgJogador: function(flgJogador) {
		this.flgJogador = flgJogador;
	},
	setCor: function(cor) {
		this.cor = cor;
	},
	setCorLinha: function(corLinha) {
		this.corLinha = corLinha;
	},
	setPontuacao: function(pontuacao) {
		this.pontuacao = pontuacao;
	}
}

//var jogador = true;
var jogador1;
var jogador2;
var jogadorAtual;
var canvas;
var ctx;

var radius     = 5; //raio
var  startAngle = 0; // Starting point on circle
var  endAngle   = Math.PI* 2; // End point on circle
var  clockwise  = true; // clockwise or anticlockwise

var pontos = new Array(6); //matriz 6x6
var linhas = new Array(60); //60 linhas
var quadrados = new Array(25); //25 quadrados

function desenharPonto(ponto) {
	ctx.fillStyle = '#000';
	ctx.beginPath();
	ctx.arc(ponto.x,ponto.y,radius,startAngle,endAngle, clockwise);
	ctx.fill();
}
function desenharPontos() {
	for (var i=0; i<pontos.length;i++) {
		for (var j=0; j<pontos[i].length;j++) {
			desenharPonto(pontos[i][j]);
		}
	}
}
function criarQuadrados() {
	var indice = 0;
	for (var i=1; i<6;i++) {
		for (var j=1; j<6;j++) {
			var p1 = pontos[i-1][j-1];
			var p2 = pontos[i][j-1];
			var p3 = pontos[i-1][j];
			var p4 = pontos[i][j];

			var l1 = getIndiceLinha(new Linha(p1,p2));
			var l2 = getIndiceLinha(new Linha(p1,p3));
			var l3 = getIndiceLinha(new Linha(p2,p4));
			var l4 = getIndiceLinha(new Linha(p3,p4));
			
			var arrayPontos = [p1,p2,p3,p4];
			var arrayLinhas = [linhas[l1], linhas[l2], linhas[l3], linhas[l4]];
			
			quadrados[indice] = new Quadrado(arrayPontos, arrayLinhas);
			indice++;
		}
	}
}
function criarPontos() {
	for (var i=0; i<6;i++) {
		pontos[i] = new Array(6);
		for (var j=0; j<6;j++){
			pontos[i][j] = new Ponto(calc(i),calc(j));
		}
	}
}
function criarLinhas() {
	var indice = 0;
	var linha;
	for (var i=0; i<pontos.length;i++) {
		for (var j=1; j<pontos[i].length;j++) {
			linha = new Linha(pontos[i][j-1], pontos[i][j]);
			linhas[indice] = linha;
			indice++;
			linha = new Linha(pontos[j-1][i], pontos[j][i]);
			linhas[indice] = linha;
			indice++;
		}
	}
}
function calc(ij) {
	return 25 + (ij * 50);
}
function marcarLinha(linha) {
	var indice = getIndiceLinha(linha);
	if (!linhas[indice].marcada) {
		linhas[indice].marcada = true;
		desenharLinha(linha.p1, linha.p2);
	}
}
function fezQuadrado(linha) {
	var retorno = false;
	var quad = obterQuadrados(linha);
	for (var i=0; i<quad.length; i++) {
		if (quad.jogador == null) {
			var marcadas = 0;
			for (var j=0; j<quad[i].linhas.length; j++) {
				if (quad[i].linhas[j].marcada) {
					marcadas++;
				}
			}
			if (marcadas == 4) {
				quad[i].jogador = jogadorAtual;
				pintarQuadrado(quad[i]);
				jogadorAtual.pontuacao += 1;
				$('jogador' + (jogadorAtual.flgJogador ? '1': '2')).update(jogadorAtual.pontuacao);
				retorno = true;
			}
		}
	}
	return retorno;
}
function pintarQuadrado(quadrado) {
	ctx.fillStyle = jogadorAtual.cor;
	ctx.beginPath();
	ctx.moveTo(quadrado.pontos[0].x + 10, quadrado.pontos[0].y + 10);
	ctx.lineTo(quadrado.pontos[1].x -10, quadrado.pontos[1].y + 10);
	ctx.lineTo(quadrado.pontos[3].x - 10, quadrado.pontos[3].y -10);
	ctx.lineTo(quadrado.pontos[2].x + 10, quadrado.pontos[2].y -10);
	ctx.closePath();
	ctx.fill();
}

function obterQuadrados(linha){
	var array = new Array();
	var indice=0;
	
	for (var i=0; i< quadrados.length; i++ ) {
		var q = quadrados[i];
		for (var j=0; j<quadrados[i].linhas.length; j++) {
			var l = quadrados[i].linhas[j];
			if (linhaEquals(linha, l)) {
				array[indice] = quadrados[i];
				indice++;
			}
		}
	}
	return array;
}

function getIndiceLinha(linha) {
	var retorno;
	for (var i=0; i < linhas.length; i++) {
		var l = linhas[i];
		if (linhaEquals(linha, l)) {
			retorno = i;
			break;
		}
	}
	return retorno;
}

function linhaEquals(l, l2) {
	return (l.p1.x == l2.p1.x && l.p1.y == l2.p1.y && l.p2.x == l2.p2.x && l.p2.y == l2.p2.y) ||
		(l.p1.x == l2.p2.x && l.p1.y == l2.p2.y && l.p2.x == l2.p1.x && l.p2.y == l2.p1.y);
}

function desenharLinha(p, q) {
	ctx.beginPath();
	ctx.strokeStyle   = jogadorAtual.corLinha;
	ctx.moveTo(p.x, p.y);
	ctx.lineTo(q.x, q.y);
	ctx.stroke();
}
function posicaoCursor(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) {
	  x = e.pageX;
	  y = e.pageY;
	} else {
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	return new Ponto(x,y);
}
function main(e) {
	var p = posicaoCursor(e);
	var linha = getLinha(p);
	linha = linhas[getIndiceLinha(linha)];
	if (!linha.marcada) {
		marcarLinha(linha);
		var fez = fezQuadrado(linha); 
		if (fez) {
			if (houveVencedor()) {
				alertVencedor();
			}
		} else {
			jogadorAtual = jogadorAtual.flgJogador ? jogador2: jogador1;
			$('jogadorAtual').setStyle({
				backgroundColor: isIe() ? jogadorAtual.corLinha : jogadorAtual.cor
			});
		}
	}
}
function alertVencedor() {
	if (jogador1.pontuacao > jogador2.pontuacao) {
		alert('Jogador1 venceu !!!!!!! bora baeeeeea !!!!');
	} else if (jogador2.pontuacao > jogador1.pontuacao) {
		alert('Jogador2 venceu !!!!!!! bora baeeeeea !!!!');
	} else {
		alert('Empatou!');
	} 
}
function houveVencedor() {
	var retorno = true;
	for (var i=0; i<quadrados.length;i++) {
		if (quadrados[i].jogador == null) {
			retorno = false;
			break;
		}
	}
	return retorno;
}
function getLinha(p) {
	var ax = aproxima(p.x);
	var ay = aproxima(p.y);
	var p1 = new Ponto(ax,ay);
	var p2 = pontoMaisPerto(p1,p);
	var linha = new Linha(p1,p2);
	return linha;
}
function pontoMaisPerto(p1, p) {
	var maxX = max(p.x);
	var maxY = max(p.y);
	var minX = min(p.x);
	var minY = min(p.y);
	var x;
	var y;
	var t1 = modulo(p1.x - p.x);
	var t2 = modulo(p1.y - p.y);
	if (t1 > t2) {
		if (p1.x - p.x < 0) {
			x = maxX;
		} else {
			x = minX;
		}
		if (p1.y - p.y < 0) {
			y = minY;
		} else {
			y = maxY;
		}
	} else {
		if (p1.x - p.x < 0) {
			x = minX;
		} else {
			x = maxX;
		}
		if (p1.y - p.y < 0) {
			y = maxY;
		} else {
			y = minY;
		}
	}
	
	var p2 = new Ponto(x, y);
	return p2;
}
function modulo(number) {
	var retorno = number;
	if (number < 0) {
		retorno = retorno * -1;
	}
	return retorno;
}

function aproxima(x) {
	var retorno;
	if (x >=0 && x<50) {
		retorno = 25;
	} else if (x >=50 && x<100) {
		retorno = 75;
	} else if (x >=100 && x<150) {
		retorno = 125;
	} else if (x >=150 && x<200) {
		retorno = 175;
	} else if (x >=200 && x<250) {
		retorno = 225;
	} else if (x >=250 && x<300) {
		retorno = 275;
	}
	return retorno;
}

function max(x) {
	var max;
	if (x <= 25) {
		max = 25;
	} else if (x >25 && x<=75) {
		max = 75;
	} else if (x >75 && x<=125) {
		max = 125;
	} else if (x >125 && x<=175) {
		max = 175;
	} else if (x >175 && x<=225) {
		max = 225;
	} else if (x >225 && x<=300) {
		max = 275;
	}
	return max;
	
}
function min(x) {
	var min;
	if (x < 25) {
		min = 25;
	} else if (x >=25 && x<75) {
		min = 25;
	} else if (x >=75 && x<125) {
		min = 75;
	} else if (x >=125 && x<175) {
		min = 125;
	} else if (x >=175 && x<225) {
		min = 175;
	} else if (x >=225 && x<275) {
		min = 225;
	} else if (x >=275 && x<300) {
		min = 275;
	}
	return min;
}
function imprimeLinha(linha) {
	alert('P1(' + imprimePonto(linha.p1) + '); P2(' + imprimePonto(linha.p2) + ')' );
}
function imprimePonto(p) {
	return '(' + p.x + ',' + p.y + ')';
}

function novo() {
	jogador1 = new Jogador(true,  'rgba(0,0,255, 0.3)', 'rgb(0,0,255)' );
	jogador2 = new Jogador(false, 'rgba(255,0,0, 0.3)', 'rgb(255,0,0)' );
	jogadorAtual = jogador1;
	$('jogadorAtual').setStyle({
		backgroundColor: isIe() ? jogadorAtual.corLinha : jogadorAtual.cor
	});
	$('jogador1').update(jogadorAtual.pontuacao);
	$('jogador2').update(jogadorAtual.pontuacao);
	canvas= document.getElementById('pontinho');
	ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,300,300);
	criarPontos();
	criarLinhas();
	criarQuadrados();
	desenharPontos();
	Event.observe('pontinho', 'click', main);
}