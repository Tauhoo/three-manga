import { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MangaMaterial } from 'three-manga'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const animate = () => {
    if (rendererRef.current == null) return
    if (cameraRef.current == null) return
    if (sceneRef.current == null) return
    if (controlsRef.current == null) return

    const renderer = rendererRef.current
    const camera = cameraRef.current
    const scene = sceneRef.current
    const controls = controlsRef.current

    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (rendererRef.current !== null) return
    if (cameraRef.current !== null) return
    if (sceneRef.current !== null) return
    if (controlsRef.current !== null) return
    if (containerRef.current == null) return

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.pixelRatio = window.devicePixelRatio
    containerRef.current.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const controls = new OrbitControls(camera, renderer.domElement)

    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 50)
    const material = new MangaMaterial()
    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)
    camera.position.z = 3

    rendererRef.current = renderer
    cameraRef.current = camera
    sceneRef.current = scene
    controlsRef.current = controls

    animate()
  }, [])
  return (
    <>
      <div ref={containerRef} style={{ height: '100vh', width: '100vw' }}></div>
    </>
  )
}

export default App
