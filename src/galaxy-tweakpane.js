import * as THREE from 'three'
import vertexShader from './shaders/galaxy/vertex.glsl?raw'
import fragmentShader from './shaders/galaxy/fragment.glsl?raw'

export default class Galaxy {
    constructor(scene, pane) {
        this.scene = scene
        this.pane = pane

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
        if (!this.pane) return

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

        const folder = this.pane.addFolder({
            title: 'Galaxy Generator',
            expanded: true
        })

        const presetBinding = folder.addInput(this.parameters, 'preset', {
            options: Object.keys(presets).reduce((acc, key) => {
                acc[key] = key
                return acc
            }, {})
        })
        
        presetBinding.on('change', (ev) => {
            const preset = presets[ev.value]
            Object.assign(this.parameters, preset)
            this.generateGalaxy()
            // Update all bindings to reflect new values
            Object.keys(preset).forEach(key => {
                if (this.controllers[key]) {
                    // Tweakpane binding refresh
                    const binding = this.controllers[key]
                    if (binding.refresh) {
                        binding.refresh()
                    }
                }
            })
        })

        // Save controllers for preset updates
        this.controllers = {}
        
        this.controllers.count = folder.addInput(this.parameters, 'count', {
            min: 100,
            max: 1000000,
            step: 100
        }).on('change', () => this.generateGalaxy())

        this.controllers.size = folder.addInput(this.parameters, 'size', {
            min: 0.001,
            max: 0.1,
            step: 0.001
        }).on('change', () => this.generateGalaxy())

        this.controllers.radius = folder.addInput(this.parameters, 'radius', {
            min: 0.01,
            max: 20,
            step: 0.01
        }).on('change', () => this.generateGalaxy())

        this.controllers.branches = folder.addInput(this.parameters, 'branches', {
            min: 2,
            max: 20,
            step: 1
        }).on('change', () => this.generateGalaxy())

        this.controllers.spin = folder.addInput(this.parameters, 'spin', {
            min: -5,
            max: 5,
            step: 0.001
        }).on('change', () => this.generateGalaxy())

        this.controllers.randomness = folder.addInput(this.parameters, 'randomness', {
            min: 0,
            max: 2,
            step: 0.001
        }).on('change', () => this.generateGalaxy())

        this.controllers.randomnessPower = folder.addInput(this.parameters, 'randomnessPower', {
            min: 1,
            max: 10,
            step: 0.001
        }).on('change', () => this.generateGalaxy())

        this.controllers.insideColor = folder.addInput(this.parameters, 'insideColor').on('change', () => this.generateGalaxy())
        this.controllers.outsideColor = folder.addInput(this.parameters, 'outsideColor').on('change', () => this.generateGalaxy())
    }

    update(elapsedTime) {
        if (this.material) {
            this.material.uniforms.uTime.value = elapsedTime
        }
    }
}

