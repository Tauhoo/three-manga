import { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MangaDirectionalLight, MangaShaderManager } from 'three-manga'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const mangaShaderManagerRef = useRef<MangaShaderManager | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)

  const animate = () => {
    if (rendererRef.current == null) return
    if (cameraRef.current == null) return
    if (sceneRef.current == null) return
    if (controlsRef.current == null) return
    if (mangaShaderManagerRef.current == null) return
    if (meshRef.current == null) return

    const renderer = rendererRef.current
    const camera = cameraRef.current
    const scene = sceneRef.current
    const controls = controlsRef.current
    const mangaShaderManager = mangaShaderManagerRef.current

    controls.update()
    mangaShaderManager.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (rendererRef.current !== null) return
    if (cameraRef.current !== null) return
    if (sceneRef.current !== null) return
    if (controlsRef.current !== null) return
    if (mangaShaderManagerRef.current !== null) return
    if (containerRef.current == null) return

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.pixelRatio = window.devicePixelRatio
    renderer.shadowMap.enabled = true

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.pixelRatio = window.devicePixelRatio
    containerRef.current.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    const controls = new OrbitControls(camera, renderer.domElement)
    const mangaLight = new MangaDirectionalLight(-2, 2, 2, -2, 1, 5)

    const mangaShaderManager = new MangaShaderManager({
      renderer: renderer,
      scene: scene,
      camera: camera,
      lightList: [mangaLight],
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      shadowDepthTexturepixelsPerUnit: 1024 * 2,
    })
    const material = mangaShaderManager.getMangaMaterial()

    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 400, 100)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    mesh.castShadow = true

    camera.position.z = 3
    mangaLight.position.z += 2
    mangaLight.position.x += 2
    mangaLight.position.y += 2
    mangaLight.lookAt(mesh.position)

    scene.add(mesh)
    scene.add(mangaLight)

    rendererRef.current = renderer
    cameraRef.current = camera
    sceneRef.current = scene
    controlsRef.current = controls
    meshRef.current = mesh
    mangaShaderManagerRef.current = mangaShaderManager

    animate()
  }, [])
  return (
    <>
      <div ref={containerRef} style={{ height: '100vh', width: '100vw' }}></div>
    </>
  )
}

export default App
