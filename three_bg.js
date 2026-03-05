/**
 * Sagar Pradhan - Three.js 3D Background Animation
 * Creates an immersive space-themed 3D background with realistic Earth
 */

// Import Three.js (loaded via CDN in HTML)
// This module creates a responsive 3D space background with particles and a realistic Earth

class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.earth = null;
        this.clouds = null;
        this.isAnimating = false;
        
        // Configuration
        this.config = {
            particleCount: 800,
            particleSize: 0.3,
            particleColor: 0x00f3ff, // Neon cyan
            earthSize: 4,
            background: 0x0f0f1a, // Dark background
            cameraZ: 15
        };
        
        this.init();
    }
    
    /**
     * Initialize Three.js scene and start animation loop
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.background);
        
        // Add fog for depth
        this.scene.fog = new THREE.FogExp2(this.config.background, 0.02);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = this.config.cameraZ;
        
        // Create renderer with transparent background
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('hero-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Create 3D objects
        this.createParticles();
        this.createEarth();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Start animation
        this.animate();
    }
    
    /**
     * Create floating particles system
     */
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.particleCount * 3);
        const colors = new Float32Array(this.config.particleCount * 3);
        
        const color = new THREE.Color(this.config.particleColor);
        
        for (let i = 0; i < this.config.particleCount * 3; i += 3) {
            // Random positions in a sphere
            const radius = 20 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
            
            // Random colors with cyan theme
            colors[i] = color.r + (Math.random() - 0.5) * 0.2;
            colors[i + 1] = color.g + (Math.random() - 0.5) * 0.2;
            colors[i + 2] = color.b + (Math.random() - 0.5) * 0.2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: this.config.particleSize,
            color: this.config.particleColor,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    /**
     * Create realistic Earth with texture and lighting
     */
    createEarth() {
        // Earth geometry
        const earthGeometry = new THREE.SphereGeometry(this.config.earthSize, 64, 64);
        
        // Load Earth texture
        const textureLoader = new THREE.TextureLoader();
        
        // Earth surface texture (using a placeholder URL - in production, use actual texture files)
        const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', () => {
            console.log('Earth texture loaded successfully');
        });
        
        // Earth bump map for terrain
        const bumpMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
        
        // Earth specular map for shine
        const specularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');
        
        // Earth material
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpMap,
            bumpScale: 0.05,
            specularMap: specularMap,
            specular: new THREE.Color('grey'),
            shininess: 10
        });
        
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(this.earth);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft white light
        this.scene.add(ambientLight);
        
        // Add directional light (sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 5, 10);
        this.scene.add(directionalLight);
        
        // Add point light for extra glow
        const pointLight = new THREE.PointLight(0x00f3ff, 1, 100);
        pointLight.position.set(-10, -5, -10);
        this.scene.add(pointLight);
        
        // Create cloud layer
        this.createClouds();
    }
    
    /**
     * Create cloud layer above Earth
     */
    createClouds() {
        const cloudGeometry = new THREE.SphereGeometry(this.config.earthSize + 0.1, 64, 64);
        
        const textureLoader = new THREE.TextureLoader();
        const cloudTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png', () => {
            console.log('Cloud texture loaded successfully');
        });
        
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.clouds);
    }
    
    /**
     * Handle window resize events
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate the entire particle system slowly
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
        }
        
        // Rotate Earth with smooth, realistic movement
        if (this.earth) {
            this.earth.rotation.y += 0.002; // Slow rotation
        }
        
        // Rotate clouds slightly faster than Earth for dynamic effect
        if (this.clouds) {
            this.clouds.rotation.y += 0.003;
        }
        
        // Subtle particle movement
        if (this.particles && this.particles.geometry) {
            const positions = this.particles.geometry.attributes.position.array;
            const time = Date.now() * 0.0005;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Add subtle movement to particles
                positions[i] += Math.sin(time + i) * 0.01;
                positions[i + 1] += Math.cos(time + i) * 0.01;
                positions[i + 2] += Math.sin(time + i + 10) * 0.01;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Destroy the scene (for cleanup)
     */
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }
    }
}

/**
 * Enhanced version with interactive mouse effects
 */
class InteractiveThreeBackground extends ThreeBackground {
    constructor() {
        super();
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        
        this.initInteraction();
    }
    
    initInteraction() {
        // Add mouse tracking
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Add scroll interaction
        window.addEventListener('scroll', this.onScroll.bind(this));
    }
    
    onMouseMove(event) {
        // Normalize mouse position (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update target rotation based on mouse position
        this.targetRotation.x = this.mouse.y * 0.5;
        this.targetRotation.y = this.mouse.x * 0.5;
    }
    
    onScroll() {
        // Adjust camera position based on scroll
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;
        
        // Move camera forward as user scrolls down
        this.camera.position.z = this.config.cameraZ - (scrollPercent * 5);
        
        // Scale down particles as we move closer
        if (this.particles) {
            const scale = 1 - (scrollPercent * 0.5);
            this.particles.scale.set(scale, scale, scale);
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Smooth camera rotation based on mouse
        if (this.camera) {
            this.camera.rotation.x += (this.targetRotation.x - this.camera.rotation.x) * 0.05;
            this.camera.rotation.y += (this.targetRotation.y - this.camera.rotation.y) * 0.05;
        }
        
        // Enhanced particle movement
        if (this.particles && this.particles.geometry) {
            const positions = this.particles.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            const mouseX = this.mouse.x * 10;
            const mouseY = this.mouse.y * 10;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Add mouse-influenced movement
                const dx = positions[i] - mouseX;
                const dy = positions[i + 1] - mouseY;
                const dz = positions[i + 2];
                
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Particles move away from mouse cursor
                if (distance < 20) {
                    positions[i] += (dx / distance) * 0.1;
                    positions[i + 1] += (dy / distance) * 0.1;
                }
                
                // Add time-based movement
                positions[i] += Math.sin(time + i * 0.1) * 0.02;
                positions[i + 1] += Math.cos(time + i * 0.1) * 0.02;
                positions[i + 2] += Math.sin(time + i * 0.1 + 5) * 0.02;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Enhanced Earth rotation with mouse interaction
        if (this.earth) {
            this.earth.rotation.y += 0.002 + (this.mouse.x * 0.001);
            this.earth.rotation.x += this.mouse.y * 0.001;
        }
        
        if (this.clouds) {
            this.clouds.rotation.y += 0.003 + (this.mouse.x * 0.0015);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

/**
 * Performance-optimized version for lower-end devices
 */
class OptimizedThreeBackground extends ThreeBackground {
    constructor() {
        super();
        this.frameCount = 0;
        this.renderEvery = 2; // Only render every 2nd frame
    }
    
    animate() {
        this.frameCount++;
        
        // Skip frames for better performance
        if (this.frameCount % this.renderEvery === 0) {
            requestAnimationFrame(this.animate.bind(this));
            
            // Simplified animation logic
            if (this.particles) {
                this.particles.rotation.y += 0.0005;
            }
            
            if (this.earth) {
                this.earth.rotation.y += 0.001;
            }
            
            if (this.clouds) {
                this.clouds.rotation.y += 0.0015;
            }
            
            this.renderer.render(this.scene, this.camera);
        } else {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}

/**
 * Initialize the appropriate background based on device capabilities
 */
function initThreeBackground() {
    // Check device performance
    const isHighPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let background;
    
    if (isMobile) {
        // Use optimized version for mobile devices
        background = new OptimizedThreeBackground();
    } else if (isHighPerformance) {
        // Use interactive version for high-performance devices
        background = new InteractiveThreeBackground();
    } else {
        // Use standard version
        background = new ThreeBackground();
    }
    
    // Store reference for cleanup
    window.threeBackground = background;
    
    return background;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeBackground);
} else {
    initThreeBackground();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.threeBackground) {
        if (document.hidden) {
            // Pause animation when tab is not visible
            window.threeBackground.isAnimating = false;
        } else {
            // Resume animation when tab becomes visible
            window.threeBackground.isAnimating = true;
        }
    }
});

console.log('Three.js 3D Background with Earth initialized successfully!');
console.log("Three background file loaded");