import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Galaxy from './galaxy-leva.js'

/**
 * Base
 */
// Debug - Leva는 React 훅 기반이므로 바닐라 JS에서는 제한적
// 여기서는 Leva 스타일의 커스텀 HTML GUI를 사용
const gui = {
    // Leva 스타일의 인터페이스를 제공하는 간단한 래퍼
    add: () => ({ on: () => { } }),
    set: () => { }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const galaxy = new Galaxy(scene, gui)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // 전체화면 여부 확인
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement

    // Update sizes - 전체화면이면 스크린 크기, 아니면 윈도우 크기
    sizes.width = isFullscreen ? screen.width : window.innerWidth
    sizes.height = isFullscreen ? screen.height : window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update composer
    composer.setSize(sizes.width, sizes.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post processing
 */
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
bloomPass.threshold = 0
bloomPass.strength = 0.6
bloomPass.radius = 0

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)

// Bloom 객체를 Galaxy에 전달
galaxy.setBloomPass(bloomPass)

// FPS 표시
const fpsContainer = document.createElement('div')
fpsContainer.id = 'fps-display'
fpsContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 8px 12px;
    background: rgba(20, 20, 20, 0.8);
    border-radius: 6px;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 14px;
    font-weight: 600;
    color: #4ade80;
    z-index: 1000;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`
fpsContainer.textContent = 'FPS: --'
document.body.appendChild(fpsContainer)

/**
 * Fullscreen functionality
 */
const fullscreenButton = document.createElement('button')
fullscreenButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
`
fullscreenButton.id = 'fullscreen-btn'
fullscreenButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    background: rgba(20, 20, 20, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`

fullscreenButton.addEventListener('mouseenter', () => {
    fullscreenButton.style.background = 'rgba(30, 30, 30, 0.95)'
    fullscreenButton.style.borderColor = 'rgba(255, 255, 255, 0.4)'
    fullscreenButton.style.transform = 'scale(1.1)'
})

fullscreenButton.addEventListener('mouseleave', () => {
    fullscreenButton.style.background = 'rgba(20, 20, 20, 0.9)'
    fullscreenButton.style.borderColor = 'rgba(255, 255, 255, 0.2)'
    fullscreenButton.style.transform = 'scale(1)'
})

function toggleFullscreen() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {
        // Enter fullscreen - 캔버스만 전체화면 (UI 숨김)
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen()
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen()
        }
    } else {
        // Exit fullscreen (ESC 키로도 자동 호출됨)
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        }
    }
}

fullscreenButton.addEventListener('click', toggleFullscreen)

// Update button icon based on fullscreen state
function updateFullscreenButton() {
    const isFullscreen = !!document.fullscreenElement
    if (isFullscreen) {
        fullscreenButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
        `
    } else {
        fullscreenButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        `
    }
}

// Listen for fullscreen changes
function handleFullscreenChange() {
    updateFullscreenButton()
    // Trigger resize to update renderer
    window.dispatchEvent(new Event('resize'))
}

document.addEventListener('fullscreenchange', handleFullscreenChange)
document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
document.addEventListener('mozfullscreenchange', handleFullscreenChange)
document.addEventListener('MSFullscreenChange', handleFullscreenChange)

// Keyboard shortcut: F11 or F key for fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
    } else if (e.key === 'f' || e.key === 'F') {
        // Only trigger if not typing in an input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            toggleFullscreen()
        }
    }
})

// 캔버스 더블클릭으로도 전체화면 전환
canvas.addEventListener('dblclick', toggleFullscreen)

document.body.appendChild(fullscreenButton)

/**
 * Animate
 */
const clock = new THREE.Clock()

// FPS 계산 변수
let frameCount = 0
let lastFpsTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // FPS 계산 (0.5초마다 업데이트)
    frameCount++
    if (elapsedTime - lastFpsTime >= 0.5) {
        const fps = Math.round(frameCount / (elapsedTime - lastFpsTime))
        fpsContainer.textContent = `FPS: ${fps}`

        // FPS에 따라 색상 변경
        if (fps >= 50) {
            fpsContainer.style.color = '#4ade80' // 녹색
        } else if (fps >= 30) {
            fpsContainer.style.color = '#facc15' // 노란색
        } else {
            fpsContainer.style.color = '#f87171' // 빨간색
        }

        frameCount = 0
        lastFpsTime = elapsedTime
    }

    // Update galaxy
    galaxy.update(elapsedTime)

    // Update controls
    controls.update()

    // Render
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

