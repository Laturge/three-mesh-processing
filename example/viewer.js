var camera, controls, scene, renderer, chunks;
            
init();
animate();
            
function init() {
            
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
            
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
          
    document.body.appendChild(renderer.domElement);
            
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
    camera.position.z = 2;
            
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // remove when using animation loop
            
    var light = new THREE.DirectionalLight(0xffffff);

    light.position.set(1, 1, 1);
    scene.add(light);
            
    var light = new THREE.DirectionalLight(0x888888);

    light.position.set(-1, -1, -1);
    scene.add(light);
            
    var light = new THREE.AmbientLight(0x444444);

    scene.add(light);

    chunks = new THREE.Object3D();
    scene.add(chunks);
    
    window.addEventListener('resize', onWindowResize, false);
}

function clearScene() {
    while (scene.children.length > 0)
        scene.remove(scene.children[0]);
}

function addMesh(mesh) {
        
    mesh.material = new THREE.MeshPhongMaterial({
        color: Math.random()*0xffffff,
        flatShading: true,
        side: THREE.DoubleSide
    });
    chunks.add(mesh);
}
            
function onWindowResize() {
            
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
            
    renderer.setSize(window.innerWidth, window.innerHeight);
            
}
            
function animate() {
            
    requestAnimationFrame(animate);
            
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
            
    render();
            
}
            
function render() {
            
    renderer.render(scene, camera);
            
}
                    