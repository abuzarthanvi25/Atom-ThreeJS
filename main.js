import './style.css'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls" 
import gsap from 'gsap';

//ANCHOR - SCENE
const scene = new THREE.Scene();

//ANCHOR - LIGHT
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

//ANCHOR - CREATE SPHERE
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//ANCHOR - CREATE ORBIT
const orbit1 = new THREE.TorusGeometry(9.9, 0.01, 16, 100, 6.283185)
const orbitMaterial = new THREE.MeshStandardMaterial({
  color: "#fff",
  side: THREE.DoubleSide,
  roughness: 0.5
})
const orbitMesh = new THREE.Mesh(orbit1, orbitMaterial)


const electron = new THREE.SphereGeometry(0.3, 32, 16)
const electronMaterial = new THREE.MeshBasicMaterial({
  color: "white",
})
const electronObj = new THREE.Mesh(electron, electronMaterial)
const clonedElectron1 = electronObj.clone()
const clonedElectron2 = electronObj.clone()
const clonedElectron3 = electronObj.clone()
scene.add(clonedElectron1)
scene.add(clonedElectron2)
scene.add(clonedElectron3)
//ANCHOR -  ORBITS
const clonedOrbit1 = orbitMesh.clone()
orbitMesh.position.set(0,0,0)
clonedOrbit1.position.set(0,0,0)
clonedOrbit1.rotateX(40)
// clonedOrbit1.rotateY(40)

const clonedOrbit2 = orbitMesh.clone()
clonedOrbit2.position.set(0,0,0)
clonedOrbit2.rotateX(-40)

const clonedOrbit3 = orbitMesh.clone()
clonedOrbit3.position.set(0,0,0)
clonedOrbit3.rotateX(8)

scene.add(clonedOrbit1)
scene.add(clonedOrbit2)
scene.add(clonedOrbit3)
scene.add(orbitMesh)
scene.add(electronObj)

//ANCHOR - SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//ANCHOR - CAMERA
const camera = new THREE.PerspectiveCamera(45, sizes.width/ sizes.height, 0.1, 100)
camera.position.z = 30
scene.add(camera)

//ANCHOR - RENDERER
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//ANCHOR - CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
// controls.enableZoom = false
// controls.autoRotate = true
controls.autoRotateSpeed = 5

//ANCHOR - RESIZE
window.addEventListener("resize", () => {
    //ANCHOR - Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //ANCHOR - update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width , sizes.height)
})
let rotation = false;

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  if(rotation){
    scene.rotateZ(1)
  }else{
    scene.rotateZ(0)
  }
  window.addEventListener("mousedown", ()=> {
    rotation = false
  })

  window.addEventListener("mouseup", () => {
    rotation = true
  })

  window.requestAnimationFrame(loop)
}
loop()

window.addEventListener("keypress", () => {
  scene.rotateZ(0)
})

//ANCHOR - TIMELINEM MAGIC
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z: 0, x: 0, y:0}, {z: 1, x: 1, y:1})
tl.fromTo("nav", {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", {opacity: 0}, {opacity: 1})


//ANCHOR - MOUSE ANIMATION COLOR
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX/ sizes.width) * 255),
      Math.round((e.pageY/ sizes.height) * 255),
      150
    ]
    //ANCHOR - ANIMATE
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})

//ANCHOR - ROTATE
let q=0;
animate()
function animate(){
  q+= 0.01

  let qSin = Math.sin(q)
  let qCos = Math.cos(q)

  electronObj.position.set( -10 * qCos, -1, -10 * qSin)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}