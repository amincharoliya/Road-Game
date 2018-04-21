var scene;
var camera;
var renderer;

function init(){
scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x909BE6, 0.005 );
renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x909BE6);
renderer.setSize(window.innerWidth, window.innerHeight);
var ASPECT = window.innerWidth / window.innerHeight;

camera = new THREE.PerspectiveCamera(60, ASPECT, 0.10, 100000);  
camera.position.y = 4;
camera.position.x = -2;
camera.position.z = 65;


var Cubes = []; 
var cubeN;
var ggeometry = new THREE.BoxGeometry(15,1,100000);
var gmaterial = new THREE.MeshBasicMaterial();
gmaterial.color = new THREE.Color('#999');
var ground = new THREE.Mesh(ggeometry, gmaterial);
scene.add(ground);
ground.position.y = -1.8;

for(var r = 1; r <1000; r++){
	var roadstrip = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.01,10), new THREE.MeshNormalMaterial());
	roadstrip.position.z = -30 * r;
	scene.add(roadstrip);
}


var landgeometry = new THREE.BoxGeometry(100,-3,100000);
var landmaterial = new THREE.MeshBasicMaterial();
landmaterial.color = new THREE.Color('#1DD6AB');
var land = new THREE.Mesh(landgeometry, landmaterial);
scene.add(land);

var pgeometry = new THREE.BoxGeometry(5,2,10);
var pmaterial = new THREE.MeshBasicMaterial();
pmaterial.color = new THREE.Color('green');
var player = new THREE.Mesh(pgeometry, pmaterial);
player.name='Player'; 
player.position.z = 50;
player.position.x = 4;
scene.add(player);

function randomNumber(min,max){
	var randN = Math.random() * 10;
	randN = Math.floor(randN)
	if(randN > 5){
		return max;
	}else{
		return min;
	}
}

function randomColor(){
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return 'rgba('+ r + ',' + g + ',' + b + ',1)';
}
for(var i = 0; i<160; i++){
	var boxgeometry = new THREE.BoxGeometry(5,3,10);
	var boxmaterial = new THREE.MeshBasicMaterial();
	boxmaterial.color = new THREE.Color(randomColor());
	var box = new THREE.Mesh(boxgeometry, boxmaterial);
	//box.position.z = randomNumber(-100,-120) * i;
	box.position.z = -100 * i;
	box.position.x = randomNumber(4,-5);
	box.name = "box";
	scene.add(box);
	Cubes.push(box);
}
var pause = false;
camera.position.x = 0;
playing = false;
var score = 0,
level = 0,
Lives = 3;
function update(){
	score += 1 * (level / 3);
	if(Math.floor(score) % 200 == 0){
		level += 1;
	}
	$('#score').html("Score: "+ Math.floor(score));
	$('#level').html("Level: "+ Math.floor(level));
	camera.position.z -= 1 * level;
	player.position.z -= 1 * level;
	$(document).on("keydown",function keys(e){
		if(e.keyCode == 37){
			player.position.x = -5;
		}else if(e.keyCode == 39){
			player.position.x = 4;
		}
	});
	$('#play').on('click',function(){
		$('#menu').css('display','none');
		loop();
		playing = true;
	});
	function play(){
		document.getElementById('menu').style.display = 'none';
		loop();
		playing = true;
	}
}
function hit(){
	
	$(".highlight").toggleClass("block");
	setTimeout(function(){$(".highlight").toggleClass("block");},100);
	Lives--;
	$(".lives").text("LIFE: " + Lives);
	if(Lives == 0){
		window.cancelAnimationFrame(raf);
		alert("Gameover, You have scored " + Math.floor(score));
		window.location.reload();
	}
}
function Collision(){
	var cube = scene.getObjectByName('Player'); 
	var Box = scene.getObjectByName('box'); 
	var originPoint = cube.position.clone();
	var BoxoriginPoint = box.position.clone();
	for(var enemies = 0; enemies < Cubes.length; enemies++){
		if(Cubes[enemies].position.x == player.position.x && Cubes[enemies].position.z >= (player.position.z - 10) && Cubes[enemies].position.z <= (player.position.z)){
			if(cubeN !== Cubes[enemies].uuid){
				Cubes[enemies].material.transparent = true;
				Cubes[enemies].material.opacity = 0.2;
				hit();
			}
			cubeN = Cubes[enemies].uuid;
		}
	}
}
function render(){
	
	update();
	Collision();	
	renderer.render(scene, camera);
} 

function loop(){
	render();
	raf = window.requestAnimationFrame(loop);
}
render();
	document.body.appendChild(renderer.domElement);
}

window.onload = init;