class Settings {
	constructor() {
		// площадь блока
		this.blockSquare 		= 5;
		// размер и площадь чанка
		this.chunkSize 			= 16;
		this.chunkSquare 		= this.chunkSize * this.chunkSize;
	}
}
class Map {
    constructor(){
		this.materialArray;
		
		this.xoff = 0;
		this.zoff = 0;
		this.inc = 0.05;
		this.amplitude = 30 + (Math.random() * 70);
    }
    generation() {
		const settings = new Settings();

		const loader = new THREE.TextureLoader();
		const materialArray = ["dirt-side.jpg", "dirt-side.jpg", "dirt-side.jpg", "dirt-side.jpg", "dirt-side.jpg", "dirt-side.jpg"].map(v => {
			let texture = loader.load("/js_api/img/dirt-side.jpg");
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			return new THREE.MeshBasicMaterial({ map: texture });
		})

		this.materialArray = materialArray;

		const geometry = new THREE.BoxGeometry( settings.blockSquare, settings.blockSquare, settings.blockSquare);
		console.log(geometry);

		noise.seed(Math.random());
		for(let x = 0; x < settings.chunkSize; x++) {
			for(let z = 0; z < settings.chunkSize; z++) {
				let cube = new THREE.Mesh(geometry, materialArray);
			
				this.xoff = this.inc * x;
				this.zoff = this.inc * z;
                //alert(this.xoff * this.amplitude /5  * 5)
				let y = Math.round(noise.perlin2(this.xoff, this.zoff) * this.amplitude / 5) * 5;
                //let y = this.xoff * this.amplitude /5  * 5;
				cube.position.set(x * settings.blockSquare, y, z * settings.blockSquare);
				scene.add( cube );
				
			}
		}
	}
}
class Controls {
	constructor(controls, scene, mapWorld){
		this.controls = controls;
		this.keys = new Set();
		this.movingSpeed = 1.5;
		this.scene = scene;
		this.mapWorld = mapWorld;
	}
	// клик
	onClick(e) {
		e.stopPropagation();
		e.preventDefault();

		this.controls.lock();

		if (e.button == 0) {
			this.onLeftClick(e);
		} else if (e.button == 2) {			
			this.onRightClick(e);
		}
	}
	onRightClick(e){
		// Удаление элемента по клику

		const raycaster = new THREE.Raycaster();
		
		raycaster.setFromCamera( new THREE.Vector2(), this.controls.getObject() );
		let intersects = raycaster.intersectObjects( this.scene.children );
		
		if (intersects.length < 1)
			return;
		this.scene.remove( intersects[0].object );
	}
	onLeftClick(e) {

		const raycaster = new THREE.Raycaster();
		const settings = new Settings();

		// Поставить элемент по клику
		const geometry = new THREE.BoxGeometry(settings.blockSquare, settings.blockSquare, settings.blockSquare);
		const cube = new THREE.Mesh(geometry, this.mapWorld.materialArray);
		
		raycaster.setFromCamera( new THREE.Vector2(), this.controls.getObject() );
		const intersects = raycaster.intersectObjects( this.scene.children );
		if (intersects.length < 1)
			return;
		const psn = intersects[0].object.position;
		switch(intersects[0].face.materialIndex) {
			case 0:
				cube.position.set(psn.x + 5, psn.y, psn.z); 
				break;
			case 1: 
				cube.position.set(psn.x - 5, psn.y, psn.z); 
				break;
			case 2:
				cube.position.set(psn.x, psn.y + 5, psn.z); 
				break;
			case 3:
				cube.position.set(psn.x, psn.y - 5, psn.z); 
				break;
			case 4:
				cube.position.set(psn.x, psn.y, psn.z + 5); 
				break;
			case 5: 
				cube.position.set(psn.x, psn.y, psn.z - 5); 
				break;
		}

		this.scene.add(cube);
	}
	// нажали на клавишу
	inputKeydown(e) {
		this.keys.add(e.key.toLowerCase());
	}

	// отпустили клавишу
	inputKeyup(e) {
		this.keys.delete(e.key.toLowerCase());
	}

	update() {
		// Движение камеры

		// Вперёд и назад
		if ( this.keys.has("w") || this.keys.has("ц") ) {
			this.controls.moveForward(this.movingSpeed);
		} else if ( this.keys.has("s") || this.keys.has("ы") ) {
			this.controls.moveForward(-1 * this.movingSpeed);
		}

		// Вправо и влево
		if ( this.keys.has("d") || this.keys.has("в") ) {
			this.controls.moveRight(this.movingSpeed);
		} else if ( this.keys.has("a") || this.keys.has("ф") ) {
			this.controls.moveRight(-1 * this.movingSpeed);
		}

		// Вниз и вверх
		if ( this.keys.has("shift")) {
			this.controls.moveUp(-this.movingSpeed / 2);
		} else if (this.keys.has(" ")) {
			this.controls.moveUp(this.movingSpeed / 2);
		}
	}
}

///const canvas				= document.querySelector("#game");
var scene 				= new THREE.Scene();
scene.background 			= new THREE.Color(0x00ffff);
scene.fog 					= new THREE.Fog(0x00ffff, 10, 650);
const renderer 				= new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const camera 	= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
document.body.appendChild( renderer.domElement );
camera.position.set(50, 40, 50);

let mapWorld = new Map();
mapWorld.generation();
 import { PointerLockControls } from 'PointerLockControls.js';
alert(5);
let controls = new Controls( new PointerLockControls(camera, document.body),  scene, mapWorld );
alert(55);
window.addEventListener( "keydown", (e)=>{ controls.inputKeydown(e); } );
window.addEventListener( "keyup", (e)=>{ controls.inputKeyup(e); } );
document.body.addEventListener( "click", (e) => { controls.onClick(e); }, false );
alert(555);
GameLoop();
function update(){
	// передвижение/камера
	controls.update();
};


// Игровой цикл
function GameLoop() {
	update();
	render();
	requestAnimationFrame(GameLoop);
}

// Рендер сцены(1 кадра)
function render(){
	// camera.rotation.x += 0.1;
	renderer.render(scene, camera);
}

// обновление размера игры
window.addEventListener("resize", function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});