import * as THREE from 'three'
import vertexShader from './shaders/galaxy/vertex.glsl?raw'
import fragmentShader from './shaders/galaxy/fragment.glsl?raw'

export default class Galaxy {
    constructor(scene, gui) {
        this.scene = scene
        this.gui = gui

        // Parameters
        this.parameters = {}
        this.parameters.count = 200000
        this.parameters.size = 0.005
        this.parameters.radius = 5
        this.parameters.branches = 3
        this.parameters.spin = 1
        this.parameters.randomness = 0.2
        this.parameters.randomnessPower = 3
        this.parameters.insideColor = '#ff6030'
        this.parameters.outsideColor = '#1b3984'

        this.geometry = null
        this.material = null
        this.points = null

        this.generateGalaxy()
        this.setupDebug()
    }

    generateGalaxy() {
        // Destroy old galaxy
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }

        /**
         * Geometry
         */
        this.geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(this.parameters.count * 3)
        const colors = new Float32Array(this.parameters.count * 3)
        const scales = new Float32Array(this.parameters.count * 1)
        const randomness = new Float32Array(this.parameters.count * 3)

        const colorInside = new THREE.Color(this.parameters.insideColor)
        const colorOutside = new THREE.Color(this.parameters.outsideColor)

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.parameters.radius

            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius

            positions[i3] = Math.cos(branchAngle + radius * this.parameters.spin) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle + radius * this.parameters.spin) * radius

            randomness[i3] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ

            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / this.parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

        /**
         * Material
         */
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 30 * window.devicePixelRatio }
            }
        })

        /**
         * Points
         */
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    setupDebug() {
        if (!this.gui) return

        const presets = {
            'Classic Spiral': {
                count: 200000,
                size: 0.005,
                radius: 5,
                branches: 3,
                spin: 1,
                randomness: 0.2,
                randomnessPower: 3,
                insideColor: '#ff6030',
                outsideColor: '#1b3984'
            },
            'Supernova': {
                count: 200000,
                size: 0.02,
                radius: 6,
                branches: 12,
                spin: 0.5,
                randomness: 1.2,
                randomnessPower: 2.5,
                insideColor: '#ffff00',
                outsideColor: '#ff0000'
            },
            'Ghostly': {
                count: 150000,
                size: 0.01,
                radius: 8,
                branches: 4,
                spin: 2,
                randomness: 1.5,
                randomnessPower: 4,
                insideColor: '#00ffff',
                outsideColor: '#ffffff'
            },
            'Black Hole': {
                count: 300000,
                size: 0.008,
                radius: 4,
                branches: 6,
                spin: 4,
                randomness: 0.1,
                randomnessPower: 5,
                insideColor: '#000000',
                outsideColor: '#6e21ff'
            },
            'Nebula': {
                count: 200000,
                size: 0.015,
                radius: 7,
                branches: 5,
                spin: 1,
                randomness: 2,
                randomnessPower: 3,
                insideColor: '#ff00ff',
                outsideColor: '#0000ff'
            }
        }

        this.parameters.preset = 'Classic Spiral'

        // Leva는 React 훅 기반이므로 바닐라 JS에서는 dat.GUI 스타일로 구현
        // 실제 프로덕션에서는 React와 함께 사용하거나 dat.GUI를 사용하는 것을 권장
        console.warn('Leva는 React와 함께 사용하는 것이 권장됩니다. 여기서는 간단한 구현을 사용합니다.')

        // 간단한 HTML 기반 GUI 생성 (Leva 스타일 디자인)
        this.createSimpleGUI(presets)
    }

    createSimpleGUI(presets) {
        // Leva 스타일의 간단한 HTML GUI 생성
        const guiContainer = document.createElement('div')
        guiContainer.id = 'leva-gui'
        guiContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(20, 20, 20, 0.95);
            border-radius: 8px;
            padding: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            max-height: 90vh;
            overflow-y: auto;
        `

        const titleContainer = document.createElement('div')
        titleContainer.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;'

        const title = document.createElement('div')
        title.textContent = 'Galaxy Controls'
        title.style.cssText = 'font-size: 16px; font-weight: 600; color: #fff;'

        const infoButton = document.createElement('a')
        infoButton.href = 'https://www.google.com/search?q=Three.js+galaxy+simulation+tutorial'
        infoButton.target = '_blank'
        infoButton.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
        </svg>`
        infoButton.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: #888;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
        `
        infoButton.title = '자세히 학습하기 (Google)'

        infoButton.addEventListener('mouseenter', () => {
            infoButton.style.background = 'rgba(99, 102, 241, 0.3)'
            infoButton.style.color = '#fff'
        })
        infoButton.addEventListener('mouseleave', () => {
            infoButton.style.background = 'rgba(255, 255, 255, 0.1)'
            infoButton.style.color = '#888'
        })

        titleContainer.appendChild(title)
        titleContainer.appendChild(infoButton)
        guiContainer.appendChild(titleContainer)

        // Preset selector - 버튼으로 구현
        const presetDiv = document.createElement('div')
        presetDiv.style.marginBottom = '15px'
        const presetLabel = document.createElement('label')
        presetLabel.textContent = 'Preset'
        presetLabel.style.cssText = 'display: block; margin-bottom: 8px; font-size: 12px; color: #aaa;'

        const buttonContainer = document.createElement('div')
        buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px;'

        this.presetButtons = {}
        Object.keys(presets).forEach(key => {
            const button = document.createElement('button')
            button.textContent = key
            button.style.cssText = `
                flex: 1 1 auto;
                min-width: fit-content;
                padding: 8px 12px;
                background: ${key === this.parameters.preset ? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' : '#2a2a2a'};
                border: 1px solid ${key === this.parameters.preset ? '#2563eb' : '#444'};
                border-radius: 6px;
                color: #fff;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            `

            button.addEventListener('mouseenter', () => {
                if (key !== this.parameters.preset) {
                    button.style.background = '#3a3a3a'
                    button.style.borderColor = '#666'
                }
            })

            button.addEventListener('mouseleave', () => {
                if (key !== this.parameters.preset) {
                    button.style.background = '#2a2a2a'
                    button.style.borderColor = '#444'
                }
            })

            button.addEventListener('click', () => {
                // 모든 버튼 스타일 초기화
                Object.keys(this.presetButtons).forEach(k => {
                    this.presetButtons[k].style.background = '#2a2a2a'
                    this.presetButtons[k].style.borderColor = '#444'
                })

                // 클릭된 버튼 활성화 스타일
                button.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)'
                button.style.borderColor = '#2563eb'

                // 프리셋 적용
                this.parameters.preset = key
                const preset = presets[key]
                Object.assign(this.parameters, preset)
                this.generateGalaxy()
                this.updateGUIInputs(guiContainer)
            })

            this.presetButtons[key] = button
            buttonContainer.appendChild(button)
        })

        presetDiv.appendChild(presetLabel)
        presetDiv.appendChild(buttonContainer)
        guiContainer.appendChild(presetDiv)

        // Create input fields (range 타입만)
        const rangeInputs = [
            { key: 'count', label: 'Count', type: 'range', min: 100, max: 1000000, step: 100 },
            { key: 'size', label: 'Size', type: 'range', min: 0.001, max: 0.1, step: 0.001 },
            { key: 'radius', label: 'Radius', type: 'range', min: 0.01, max: 20, step: 0.01 },
            { key: 'branches', label: 'Branches', type: 'range', min: 2, max: 20, step: 1 },
            { key: 'spin', label: 'Spin', type: 'range', min: -5, max: 5, step: 0.001 },
            { key: 'randomness', label: 'Randomness', type: 'range', min: 0, max: 2, step: 0.001 },
            { key: 'randomnessPower', label: 'Randomness Power', type: 'range', min: 1, max: 10, step: 0.001 }
        ]

        rangeInputs.forEach(input => {
            const div = document.createElement('div')
            div.style.marginBottom = '12px'

            const label = document.createElement('label')
            label.textContent = input.label
            label.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #aaa;'

            const rangeInput = document.createElement('input')
            rangeInput.type = 'range'
            rangeInput.id = `leva-${input.key}`
            rangeInput.setAttribute('data-key', input.key)
            rangeInput.min = input.min
            rangeInput.max = input.max
            rangeInput.step = input.step
            rangeInput.value = this.parameters[input.key]
            rangeInput.style.cssText = 'width: 100%;'

            const valueDisplay = document.createElement('span')
            valueDisplay.textContent = this.parameters[input.key]
            valueDisplay.style.cssText = 'float: right; color: #fff; font-size: 12px;'

            rangeInput.addEventListener('input', (e) => {
                this.parameters[input.key] = parseFloat(e.target.value)
                valueDisplay.textContent = this.parameters[input.key].toFixed(3)
                this.generateGalaxy()
            })

            div.appendChild(label)
            const inputWrapper = document.createElement('div')
            inputWrapper.style.display = 'flex'
            inputWrapper.style.alignItems = 'center'
            inputWrapper.style.gap = '10px'
            inputWrapper.appendChild(rangeInput)
            inputWrapper.appendChild(valueDisplay)
            div.appendChild(inputWrapper)

            guiContainer.appendChild(div)
        })

        // Color inputs - 가로로 나란히 배치
        const colorInputs = [
            { key: 'insideColor', label: 'Inside' },
            { key: 'outsideColor', label: 'Outside' }
        ]

        const colorContainer = document.createElement('div')
        colorContainer.style.cssText = 'display: flex; gap: 12px; margin-bottom: 12px;'

        colorInputs.forEach(input => {
            const div = document.createElement('div')
            div.style.cssText = 'flex: 1;'

            const label = document.createElement('label')
            label.textContent = input.label
            label.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #aaa;'

            const colorInput = document.createElement('input')
            colorInput.type = 'color'
            colorInput.id = `leva-${input.key}`
            colorInput.setAttribute('data-key', input.key)
            colorInput.value = this.parameters[input.key]
            colorInput.style.cssText = 'width: 100%; height: 35px; border: none; border-radius: 4px; cursor: pointer;'

            colorInput.addEventListener('change', (e) => {
                this.parameters[input.key] = e.target.value
                this.generateGalaxy()
            })

            div.appendChild(label)
            div.appendChild(colorInput)
            colorContainer.appendChild(div)
        })

        guiContainer.appendChild(colorContainer)

        // Bloom 섹션 placeholder (나중에 setBloomPass로 추가)
        this.bloomSection = document.createElement('div')
        this.bloomSection.id = 'bloom-section'
        guiContainer.appendChild(this.bloomSection)

        document.body.appendChild(guiContainer)
        this.guiContainer = guiContainer
    }

    updateGUIInputs(container) {
        // Update all input values when preset changes
        const inputs = container.querySelectorAll('input[type="range"], input[type="color"]')
        inputs.forEach(input => {
            const key = input.getAttribute('data-key')
            if (key && this.parameters[key] !== undefined) {
                input.value = this.parameters[key]
                // Update value display for range inputs
                if (input.type === 'range') {
                    const valueDisplay = input.parentElement.querySelector('span')
                    if (valueDisplay) {
                        valueDisplay.textContent = typeof this.parameters[key] === 'number'
                            ? this.parameters[key].toFixed(3)
                            : this.parameters[key]
                    }
                }
            }
        })
    }

    setBloomPass(bloomPass) {
        this.bloomPass = bloomPass
        this.addBloomControls()
    }

    addBloomControls() {
        if (!this.bloomSection || !this.bloomPass) return

        // 구분선
        const divider = document.createElement('div')
        divider.style.cssText = 'height: 1px; background: #444; margin: 15px 0;'
        this.bloomSection.appendChild(divider)

        // Bloom 제목
        const bloomTitle = document.createElement('div')
        bloomTitle.textContent = 'Bloom Effect'
        bloomTitle.style.cssText = 'font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #fff;'
        this.bloomSection.appendChild(bloomTitle)

        const bloomParams = [
            { key: 'strength', label: 'Strength', min: 0, max: 3, step: 0.01 },
            { key: 'radius', label: 'Radius', min: 0, max: 1, step: 0.01 },
            { key: 'threshold', label: 'Threshold', min: 0, max: 1, step: 0.01 }
        ]

        bloomParams.forEach(param => {
            const div = document.createElement('div')
            div.style.marginBottom = '10px'

            const label = document.createElement('label')
            label.textContent = param.label
            label.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #aaa;'

            const rangeInput = document.createElement('input')
            rangeInput.type = 'range'
            rangeInput.id = `leva-bloom-${param.key}`
            rangeInput.setAttribute('data-key', param.key)
            rangeInput.min = param.min
            rangeInput.max = param.max
            rangeInput.step = param.step
            rangeInput.value = this.bloomPass[param.key]
            rangeInput.style.cssText = 'width: 100%;'

            const valueDisplay = document.createElement('span')
            valueDisplay.textContent = this.bloomPass[param.key].toFixed(2)
            valueDisplay.style.cssText = 'float: right; color: #fff; font-size: 12px;'

            rangeInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value)
                this.bloomPass[param.key] = value
                valueDisplay.textContent = value.toFixed(2)
            })

            div.appendChild(label)
            const inputWrapper = document.createElement('div')
            inputWrapper.style.display = 'flex'
            inputWrapper.style.alignItems = 'center'
            inputWrapper.style.gap = '10px'
            inputWrapper.appendChild(rangeInput)
            inputWrapper.appendChild(valueDisplay)
            div.appendChild(inputWrapper)
            this.bloomSection.appendChild(div)
        })
    }

    update(elapsedTime) {
        if (this.material) {
            this.material.uniforms.uTime.value = elapsedTime
        }
    }
}

