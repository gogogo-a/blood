<template>
  <div class="welcome-container" ref="container" :class="{ 'transitioning': isTransitioning }">
    <!-- 过渡遮罩层 -->
    <div class="transition-overlay" :class="{ active: isTransitioning }"></div>
    
    <!-- 毛玻璃背景视频/图片 -->
    <div class="blur-background" :class="{ active: hoveredVideo || hoveredImage }">
      <video
        v-if="hoveredVideo"
        :src="hoveredVideo"
        autoplay
        muted
        loop
        class="bg-video"
      ></video>
      <img
        v-if="hoveredImage"
        :src="hoveredImage"
        class="bg-image"
      />
    </div>

    <!-- 3D 场景 -->
    <canvas ref="canvas" class="three-canvas" :class="{ blurred: hoveredVideo || hoveredImage }"></canvas>

    <!-- 悬停提示框 -->
    <div 
      class="tooltip" 
      v-if="tooltipText && !isTransitioning" 
      :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
    >
      {{ tooltipText }}
    </div>

    <!-- 视频全屏播放 -->
    <div class="fullscreen-video" v-if="fullscreenVideo" @click="closeFullscreen">
      <video
        ref="fsVideoRef"
        :src="fullscreenVideo"
        autoplay
        controls
        class="fs-video"
        @click.stop
      ></video>
      <button class="close-btn" @click="closeFullscreen">✕</button>
    </div>

    <!-- 图片全屏查看 -->
    <div class="fullscreen-image" v-if="fullscreenImage" @click="closeImageFullscreen">
      <img :src="fullscreenImage" class="fs-image" @click.stop />
      <button class="close-btn" @click="closeImageFullscreen">✕</button>
    </div>

    <!-- 标题 -->
    <div class="title-overlay" :class="{ 'fade-out': isTransitioning }">
      <h1 class="main-title">胰路护航</h1>
      <p class="sub-title">Pancreatic Pathway Glucose Care</p>
    </div>

    <!-- 动态数据展示 -->
    <div class="stats-overlay" :class="{ 'fade-out': isTransitioning }">
      <div class="stat-item">
        <span class="stat-number">{{ animatedUsers.toLocaleString() }}+</span>
        <span class="stat-label">用户信赖</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ animatedDays }}+</span>
        <span class="stat-label">天持续服务</span>
      </div>
    </div>

    <!-- 漂浮健康小贴士 -->
    <div class="floating-tips" :class="{ 'fade-out': isTransitioning }">
      <div 
        v-for="(tip, index) in floatingTips" 
        :key="index" 
        class="tip-item"
        :style="tip.style"
      >
        {{ tip.text }}
      </div>
    </div>

    <!-- 提示文字 -->
    <div class="hint-text" :class="{ 'fade-out': isTransitioning }">
      <span>移动鼠标探索 · 点击节点查看视频 · 中心进入首页</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'

const router = useRouter()
const container = ref(null)
const canvas = ref(null)
const fsVideoRef = ref(null)
const hoveredVideo = ref(null)
const hoveredImage = ref(null)
const fullscreenVideo = ref(null)
const fullscreenImage = ref(null)
const isTransitioning = ref(false) // 过渡动画状态
const tooltipText = ref('')
const tooltipPos = ref({ x: 0, y: 0 })

// 动态数字动画
const animatedUsers = ref(0)
const animatedDays = ref(0)

// 漂浮健康小贴士
const floatingTips = ref([
  { text: '💡 定时监测血糖', style: { top: '20%', left: '5%', animationDelay: '0s' } },
  { text: '🥗 均衡饮食很重要', style: { top: '35%', right: '8%', animationDelay: '2s' } },
  { text: '🏃 适量运动助健康', style: { bottom: '30%', left: '3%', animationDelay: '4s' } },
  { text: '💊 按时服药不能忘', style: { top: '60%', right: '5%', animationDelay: '1s' } },
  { text: '😴 充足睡眠益血糖', style: { bottom: '20%', right: '10%', animationDelay: '3s' } },
])

// 视频数据 - 使用public目录的静态路径，真正懒加载
const videos = [
  { name: '进入首页', file: null, isCenter: true },
  { name: '1型糖尿病原理', file: '3D动画显示1型糖尿病：β细胞破坏，胰岛素丢失，葡萄糖失衡，症状.mp4' },
  { name: '运动强化胰腺', file: '锻炼增强胰腺.mp4' },
  { name: '血糖细胞交互', file: '血糖与红细胞.mp4' },
  { name: '胰岛素合成', file: '一型糖尿病胰岛素制作动画.mp4' },
  { name: '受体信号传导', file: '胰岛素受体显示接受胰岛素和葡萄糖转运蛋白，使葡萄糖进入细胞膜内.mp4' },
  { name: 'GLP-1治疗', file: '胰高血糖素样肽分子胰高血糖素样肽-1受体对2型糖尿病的治疗有很强的作用.mp4' },
  { name: '血糖检测', file: '针扎测血糖.mp4' },
]

// 图片数据 - 使用public目录
const images = [
  { name: '实地调研', index: 1 },
  { name: '实地调研', index: 2 },
  { name: '实地调研', index: 3 },
  { name: '实地调研', index: 4 },
  { name: '实地调研', index: 5 },
  { name: '实地调研', index: 6 },
  { name: '实地调研', index: 7 },
  { name: '实地调研', index: 8 },
]

// 真正的懒加载 - 使用public目录的静态路径
const getVideoPath = (filename) => `/MP4/${encodeURIComponent(filename)}`
const getImagePath = (index) => `/sd/${index}.webp`

let scene, camera, renderer, points = [], imagePoints = [], raycaster, mouse
let animationId = null
let targetRotationX = 0, targetRotationY = 0
let dnaHelix = null
let dnaHelix2 = null // 右侧DNA
let ecgLine = null
let ecgPoints = []
let energyLines = [] // 能量流线条
let hoveredNode = null // 当前悬停的节点

const closeFullscreen = () => {
  fullscreenVideo.value = null
}

const closeImageFullscreen = () => {
  fullscreenImage.value = null
}

const initThree = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  // 场景
  scene = new THREE.Scene()
  scene.background = null // 确保背景透明
  scene.fog = new THREE.FogExp2(0xfaf6f1, 0.0008)

  // 相机
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000)
  camera.position.z = 500

  // 渲染器 - 低配优化
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: false, // 关闭抗锯齿
    alpha: true,
    powerPreference: 'low-power' // 低功耗模式
  })
  renderer.setClearColor(0x000000, 0)
  renderer.setSize(width, height)
  renderer.setPixelRatio(1) // 固定像素比为1

  // 射线检测
  raycaster = new THREE.Raycaster()
  raycaster.params.Points.threshold = 20
  mouse = new THREE.Vector2()

  // 创建背景粒子
  createBackgroundParticles()

  // 创建视频节点（分散分布，无连线）
  createVideoNodes()

  // 创建图片节点（小点，缓慢移动）
  createImageNodes()

  // 创建弧形装饰
  createArcDecorations()

  // 创建DNA双螺旋
  createDNAHelix()

  // 创建心电图波形
  createECGLine()

  // 创建多层次粒子
  createMultiLayerParticles()

  // 创建能量流线条
  createEnergyLines()

  // 事件监听
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)

  animate()
}

const createBackgroundParticles = () => {
  const geometry = new THREE.BufferGeometry()
  const count = 500 // 大幅减少粒子
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000
    positions[i + 1] = (Math.random() - 0.5) * 2000
    positions[i + 2] = (Math.random() - 0.5) * 2000
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    size: 3,
    color: 0xcd9a67,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const createVideoNodes = () => {
  // 中心节点
  const centerNode = createNode(0, 0, 0, videos[0], true)
  points.push(centerNode)
  scene.add(centerNode)

  // 预定义分散位置，避免重叠
  const positions = [
    { x: -320, y: 180, z: -80 },
    { x: 280, y: 200, z: 60 },
    { x: -250, y: -160, z: 100 },
    { x: 350, y: -120, z: -60 },
    { x: -150, y: 250, z: -120 },
    { x: 200, y: -220, z: 80 },
    { x: -380, y: -50, z: -40 },
  ]

  // 其他节点分散分布（无连线）
  for (let i = 1; i < videos.length; i++) {
    const pos = positions[i - 1]
    const node = createNode(pos.x, pos.y, pos.z, videos[i], false)
    points.push(node)
    scene.add(node)
  }
}

const createNode = (x, y, z, videoData, isCenter) => {
  const group = new THREE.Group()
  group.position.set(x, y, z)
  group.userData = { videoData, isCenter }

  // 核心球体 - 极简细分
  const coreGeometry = new THREE.SphereGeometry(isCenter ? 25 : 12, 8, 8)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: isCenter ? 0x8b4513 : 0xd87d4b,
    transparent: true,
    opacity: 0.9
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 外圈光环 - 极简细分
  const ringGeometry = new THREE.RingGeometry(isCenter ? 30 : 16, isCenter ? 35 : 19, 16)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: isCenter ? 0x8b4513 : 0xd87d4b,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  group.add(ring)

  return group
}

const createArcDecorations = () => {
  // 创建多个弧形装饰 - 使用暖色调，位置下移避开标题
  for (let i = 0; i < 2; i++) {
    const curve = new THREE.EllipseCurve(
      0, -150, // 圆心更下移
      400 + i * 120, 150 + i * 30, // 调整大小
      0, Math.PI * 2,
      false,
      i * 0.3
    )
    const curvePoints = curve.getPoints(100)
    const geometry = new THREE.BufferGeometry().setFromPoints(
      curvePoints.map(p => new THREE.Vector3(p.x, p.y, -300 - i * 100))
    )
    const material = new THREE.LineBasicMaterial({
      color: 0xcd9a67, // 暖金色
      transparent: true,
      opacity: 0.08 - i * 0.02 // 更低的透明度
    })
    const arc = new THREE.Line(geometry, material)
    arc.rotation.x = Math.PI * 0.2
    scene.add(arc)
  }
}

// 创建DNA双螺旋结构 - 简化版
const createDNAHelix = () => {
  dnaHelix = new THREE.Group()
  
  const helixHeight = 400
  const radius = 30
  const turns = 2 // 减少圈数
  const pointsPerTurn = 12 // 减少点数
  const totalPoints = turns * pointsPerTurn
  
  const helix1Points = []
  const helix2Points = []
  
  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints
    const angle = t * turns * Math.PI * 2
    const y = (t - 0.5) * helixHeight
    
    helix1Points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius))
    helix2Points.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius))
  }
  
  const helix1Geo = new THREE.BufferGeometry().setFromPoints(helix1Points)
  const helix1Mat = new THREE.LineBasicMaterial({ color: 0xd87d4b, transparent: true, opacity: 0.6 })
  dnaHelix.add(new THREE.Line(helix1Geo, helix1Mat))
  
  const helix2Geo = new THREE.BufferGeometry().setFromPoints(helix2Points)
  const helix2Mat = new THREE.LineBasicMaterial({ color: 0xcd9a67, transparent: true, opacity: 0.6 })
  dnaHelix.add(new THREE.Line(helix2Geo, helix2Mat))
  
  // 连接横杆 - 减少数量
  for (let i = 0; i <= totalPoints; i += 3) {
    const barGeo = new THREE.BufferGeometry().setFromPoints([helix1Points[i], helix2Points[i]])
    const barMat = new THREE.LineBasicMaterial({ color: 0xf0a080, transparent: true, opacity: 0.4 })
    dnaHelix.add(new THREE.Line(barGeo, barMat))
  }
  
  // 小球 - 减少数量和细分度
  const sphereGeo = new THREE.SphereGeometry(3, 8, 8)
  for (let i = 0; i <= totalPoints; i += 6) {
    const sphere1 = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0xd87d4b, transparent: true, opacity: 0.7 }))
    sphere1.position.copy(helix1Points[i])
    dnaHelix.add(sphere1)
    
    const sphere2 = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0xcd9a67, transparent: true, opacity: 0.7 }))
    sphere2.position.copy(helix2Points[i])
    dnaHelix.add(sphere2)
  }
  
  dnaHelix.position.set(-450, 0, -200)
  scene.add(dnaHelix)
  
  dnaHelix2 = dnaHelix.clone()
  dnaHelix2.position.set(450, 50, -150)
  dnaHelix2.rotation.z = Math.PI * 0.1
  scene.add(dnaHelix2)
}

// 创建心电图波形 - 简化版
const createECGLine = () => {
  const ecgGroup = new THREE.Group()
  const segments = 100 // 减少段数
  const width = 600
  
  const generateECGPoints = (offset = 0) => {
    const pts = []
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments - 0.5) * width
      const t = (i / segments) * 4 + offset
      const phase = t % 1
      let y = 0
      
      if (phase < 0.1) y = 0
      else if (phase < 0.15) y = (phase - 0.1) * 200
      else if (phase < 0.2) y = (0.2 - phase) * 200
      else if (phase < 0.3) y = 0
      else if (phase < 0.32) y = -(phase - 0.3) * 250
      else if (phase < 0.38) y = (phase - 0.32) * 800 - 5
      else if (phase < 0.44) y = (0.44 - phase) * 800 - 5
      else if (phase < 0.48) y = -(0.48 - phase) * 200
      else if (phase < 0.6) y = 0
      else if (phase < 0.75) y = Math.sin((phase - 0.6) * Math.PI / 0.15) * 30
      else y = 0
      
      pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }
  
  ecgPoints = generateECGPoints()
  const ecgGeo = new THREE.BufferGeometry().setFromPoints(ecgPoints)
  ecgLine = new THREE.Line(ecgGeo, new THREE.LineBasicMaterial({ color: 0xd87d4b, transparent: true, opacity: 0.5 }))
  ecgGroup.add(ecgLine)
  
  ecgGroup.position.set(0, -280, -100)
  ecgGroup.rotation.x = -0.2
  scene.add(ecgGroup)
}

// 创建多层次粒子 - 低配优化
const createMultiLayerParticles = () => {
  // 只保留一层粒子
  const geo = new THREE.BufferGeometry()
  const count = 300
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1500
    positions[i + 1] = (Math.random() - 0.5) * 1500
    positions[i + 2] = (Math.random() - 0.5) * 1500
  }
  
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 2,
    color: 0xf0a080,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  }))
  particles.userData.isSmallParticle = true
  scene.add(particles)
}

// 创建能量流线条 - 低配优化：减少数量
const createEnergyLines = () => {
  const lineCount = 2 // 只保留2条
  
  for (let i = 0; i < lineCount; i++) {
    const lineGroup = new THREE.Group()
    
    const startPoint = new THREE.Vector3(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 600,
      (Math.random() - 0.5) * 400
    )
    const endPoint = new THREE.Vector3(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 600,
      (Math.random() - 0.5) * 400
    )
    
    const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5)
    midPoint.y += (Math.random() - 0.5) * 200
    
    const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint)
    const curvePoints = curve.getPoints(20) // 减少点数
    
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    const material = new THREE.LineBasicMaterial({
      color: 0xd87d4b,
      transparent: true,
      opacity: 0
    })
    
    const line = new THREE.Line(geometry, material)
    lineGroup.add(line)
    
    const dotGeo = new THREE.SphereGeometry(2, 4, 4)
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffaa66,
      transparent: true,
      opacity: 0
    })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    lineGroup.add(dot)
    
    lineGroup.userData = {
      curve,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      active: false,
      nextActivation: Math.random() * 5000,
      duration: 2000 + Math.random() * 2000
    }
    
    energyLines.push(lineGroup)
    scene.add(lineGroup)
  }
}

// 创建图片节点 - 更小的点，缓慢移动
const createImageNodes = () => {
  // 图片节点位置 - 分散在空间中，避开视频节点
  const positions = [
    { x: 180, y: 80, z: 150 },
    { x: -200, y: 50, z: 180 },
    { x: 100, y: -80, z: -150 },
    { x: -120, y: 120, z: 60 },
    { x: 250, y: -50, z: -100 },
    { x: -280, y: -100, z: 50 },
    { x: 50, y: 180, z: 100 },
    { x: -80, y: -180, z: -80 },
  ]

  for (let i = 0; i < images.length; i++) {
    const pos = positions[i]
    const node = createImageNode(pos.x, pos.y, pos.z, images[i])
    imagePoints.push(node)
    scene.add(node)
  }
}

// 创建单个图片节点 - 更小，颜色更浅
const createImageNode = (x, y, z, imageData) => {
  const group = new THREE.Group()
  group.position.set(x, y, z)
  group.userData = { imageData, isImage: true }
  
  // 保存初始位置用于缓慢移动动画
  group.userData.initialPos = { x, y, z }
  group.userData.moveOffset = Math.random() * Math.PI * 2

  // 核心球体 - 更小，颜色更浅（浅珊瑚色）
  const coreGeometry = new THREE.SphereGeometry(6, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0a080, // 浅珊瑚色
    transparent: true,
    opacity: 0.85
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 外圈光环 - 更小
  const ringGeometry = new THREE.RingGeometry(8, 10, 64)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0a080,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  group.add(ring)

  // 脉冲动画环
  const pulseGeometry = new THREE.RingGeometry(10, 11, 64)
  const pulseMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0a080,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  })
  const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
  pulse.userData.isPulse = true
  group.add(pulse)

  return group
}

const onResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const onMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 相机跟随鼠标（反向，让节点向鼠标方向移动）
  targetRotationY = -mouse.x * 0.3
  targetRotationX = mouse.y * 0.2

  // 射线检测悬停 - 同时检测视频和图片节点
  raycaster.setFromCamera(mouse, camera)
  const allPoints = [...points, ...imagePoints]
  const intersects = raycaster.intersectObjects(allPoints, true)

  // 重置之前悬停的节点
  if (hoveredNode && hoveredNode !== intersects[0]?.object?.parent) {
    resetNodeScale(hoveredNode)
    hoveredNode = null
  }

  if (intersects.length > 0) {
    const obj = intersects[0].object.parent
    
    // 放大悬停的节点
    if (obj !== hoveredNode) {
      hoveredNode = obj
      enlargeNode(obj)
    }
    
    if (obj.userData.videoData) {
      // 视频节点
      tooltipText.value = obj.userData.videoData.name
      tooltipPos.value = { x: event.clientX + 15, y: event.clientY + 15 }
      document.body.style.cursor = 'pointer'
      hoveredImage.value = null
      
      if (!obj.userData.isCenter && obj.userData.videoData.file) {
        // 懒加载视频路径
        hoveredVideo.value = getVideoPath(obj.userData.videoData.file)
      } else {
        hoveredVideo.value = null
      }
    } else if (obj.userData.imageData) {
      // 图片节点
      tooltipText.value = obj.userData.imageData.name
      tooltipPos.value = { x: event.clientX + 15, y: event.clientY + 15 }
      document.body.style.cursor = 'pointer'
      hoveredVideo.value = null
      // 懒加载图片路径
      hoveredImage.value = getImagePath(obj.userData.imageData.index)
    }
  } else {
    tooltipText.value = ''
    hoveredVideo.value = null
    hoveredImage.value = null
    document.body.style.cursor = 'default'
  }
}

// 放大节点效果
const enlargeNode = (node) => {
  if (!node) return
  node.userData.targetScale = 1.5
  // 增加发光效果
  node.children.forEach(child => {
    if (child.material) {
      child.userData.originalOpacity = child.material.opacity
      child.material.opacity = Math.min(child.material.opacity * 1.5, 1)
    }
  })
}

// 重置节点大小
const resetNodeScale = (node) => {
  if (!node) return
  node.userData.targetScale = 1
  // 恢复原始透明度
  node.children.forEach(child => {
    if (child.material && child.userData.originalOpacity !== undefined) {
      child.material.opacity = child.userData.originalOpacity
    }
  })
}

// 进入首页的过渡动画
const startTransition = () => {
  isTransitioning.value = true
  
  // 开始3D场景淡出动画
  const startTime = Date.now()
  const duration = 1200
  
  const fadeOut = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 淡出所有3D对象
    scene.children.forEach(child => {
      if (child.material) {
        child.material.opacity = Math.max(0, child.material.opacity - 0.03)
      }
      if (child instanceof THREE.Group) {
        child.children.forEach(c => {
          if (c.material) {
            c.material.opacity = Math.max(0, c.material.opacity - 0.03)
          }
        })
      }
    })
    
    if (progress < 1) {
      requestAnimationFrame(fadeOut)
    } else {
      // 动画完成后跳转
      router.push('/home')
    }
  }
  
  fadeOut()
}

const onClick = async () => {
  if (isTransitioning.value) return // 防止重复点击
  
  raycaster.setFromCamera(mouse, camera)
  const allPoints = [...points, ...imagePoints]
  const intersects = raycaster.intersectObjects(allPoints, true)

  if (intersects.length > 0) {
    const obj = intersects[0].object.parent
    if (obj.userData.isCenter) {
      startTransition() // 触发过渡动画
    } else if (obj.userData.videoData?.file) {
      // 懒加载视频
      fullscreenVideo.value = getVideoPath(obj.userData.videoData.file)
      await nextTick()
      if (fsVideoRef.value) {
        try {
          await fsVideoRef.value.requestFullscreen()
        } catch (e) {
          console.log('全屏请求失败，使用弹窗模式')
        }
      }
    } else if (obj.userData.imageData?.index) {
      // 懒加载图片
      fullscreenImage.value = getImagePath(obj.userData.imageData.index)
    }
  }
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 平滑相机旋转
  camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05
  camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05

  const time = Date.now() * 0.001
  
  // 节点动画
  points.forEach((point, i) => {
    point.rotation.z = time * 0.3
    point.position.y += Math.sin(time + i) * 0.03
    
    const targetScale = point.userData.targetScale || 1
    const currentScale = point.scale.x
    const newScale = currentScale + (targetScale - currentScale) * 0.1
    point.scale.set(newScale, newScale, newScale)
  })

  // 图片节点动画
  imagePoints.forEach((point, i) => {
    const offset = point.userData.moveOffset
    const initialPos = point.userData.initialPos
    
    point.position.x = initialPos.x + Math.sin(time * 0.2 + offset) * 15
    point.position.y = initialPos.y + Math.cos(time * 0.15 + offset) * 10
    point.rotation.z = time * 0.2
    
    const targetScale = point.userData.targetScale || 1
    const currentScale = point.scale.x
    const newScale = currentScale + (targetScale - currentScale) * 0.1
    point.scale.set(newScale, newScale, newScale)
  })

  // DNA双螺旋 - 简化动画
  if (dnaHelix) {
    dnaHelix.rotation.y = time * 0.15
    dnaHelix.position.y = Math.cos(time * 0.08) * 50
  }
  
  if (dnaHelix2) {
    dnaHelix2.rotation.y = -time * 0.12
    dnaHelix2.position.y = 50 + Math.sin(time * 0.06) * 40
  }

  // 心电图动画
  if (ecgLine) {
    const positions = ecgLine.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3
      const t = (idx / (positions.length / 3)) * 4 + time * 0.4
      const phase = t % 1
      let y = 0
      
      if (phase < 0.1) y = 0
      else if (phase < 0.15) y = (phase - 0.1) * 200
      else if (phase < 0.2) y = (0.2 - phase) * 200
      else if (phase < 0.3) y = 0
      else if (phase < 0.32) y = -(phase - 0.3) * 250
      else if (phase < 0.38) y = (phase - 0.32) * 800 - 5
      else if (phase < 0.44) y = (0.44 - phase) * 800 - 5
      else if (phase < 0.48) y = -(0.48 - phase) * 200
      else if (phase < 0.6) y = 0
      else if (phase < 0.75) y = Math.sin((phase - 0.6) * Math.PI / 0.15) * 30
      else y = 0
      
      positions[i + 1] = y
    }
    ecgLine.geometry.attributes.position.needsUpdate = true
  }

  // 能量流动画
  const currentTimeMs = Date.now()
  energyLines.forEach(lineGroup => {
    const data = lineGroup.userData
    
    if (!data.active && currentTimeMs > data.nextActivation) {
      data.active = true
      data.startTime = currentTimeMs
      data.progress = 0
    }
    
    if (data.active) {
      const elapsed = currentTimeMs - data.startTime
      const progress = elapsed / data.duration
      
      if (progress >= 1) {
        data.active = false
        data.nextActivation = currentTimeMs + 3000 + Math.random() * 6000
        lineGroup.children[0].material.opacity = 0
        lineGroup.children[1].material.opacity = 0
      } else {
        const line = lineGroup.children[0]
        const dot = lineGroup.children[1]
        
        const fadeProgress = progress < 0.2 ? progress / 0.2 : 
                            progress > 0.8 ? (1 - progress) / 0.2 : 1
        line.material.opacity = fadeProgress * 0.3
        dot.material.opacity = fadeProgress * 0.7
        
        const point = data.curve.getPoint(progress)
        dot.position.copy(point)
      }
    }
  })

  // 背景粒子旋转 - 简化
  scene.children.forEach(child => {
    if (child instanceof THREE.Points) {
      child.rotation.y += 0.0002
    }
  })

  renderer.render(scene, camera)
}

onMounted(() => {
  initThree()
  
  // 启动数字动画
  const targetUsers = 10000
  const targetDays = 365
  const duration = 2000
  const startTime = Date.now()
  
  const animateNumbers = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    
    animatedUsers.value = Math.floor(targetUsers * easeProgress)
    animatedDays.value = Math.floor(targetDays * easeProgress)
    
    if (progress < 1) {
      requestAnimationFrame(animateNumbers)
    }
  }
  animateNumbers()
  
  // 监听全屏退出事件
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fullscreenVideo.value) {
      fullscreenVideo.value = null
    }
  })
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.welcome-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #faf6f1 0%, #f5ebe0 50%, #ede4d8 100%);
  overflow: hidden;
}

.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.three-canvas.blurred {
  filter: blur(6px);
  opacity: 0.4;
}

.blur-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.blur-background.active {
  opacity: 1;
}

.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
}

/* 悬停提示框 */
.tooltip {
  position: fixed;
  z-index: 100;
  background: rgba(216, 125, 75, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(216, 125, 75, 0.4);
  backdrop-filter: blur(10px);
  animation: tooltipFadeIn 0.2s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-overlay {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.main-title {
  font-size: 4rem;
  font-family: '华文行楷', '华文新魏', '楷体', cursive;
  color: #2c3e50;
  text-shadow: 0 0 30px rgba(205, 154, 103, 0.6),
               0 0 60px rgba(205, 154, 103, 0.3);
  margin: 0;
  letter-spacing: 0.5rem;
}

.sub-title {
  font-size: 1.2rem;
  color: rgba(44, 62, 80, 0.7);
  font-family: 'Times New Roman', serif;
  letter-spacing: 0.3rem;
  margin-top: 1rem;
}

.hint-text {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.hint-text span {
  font-size: 0.9rem;
  color: rgba(44, 62, 80, 0.5);
  letter-spacing: 0.2rem;
  animation: pulse 2s ease-in-out infinite;
}

/* 动态数据展示 */
.stats-overlay {
  position: absolute;
  top: 20%;
  right: 5%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
  pointer-events: none;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  animation: fadeInRight 1s ease forwards;
  opacity: 0;
}

.stat-item:nth-child(1) { animation-delay: 0.5s; }
.stat-item:nth-child(2) { animation-delay: 0.8s; }

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d87d4b;
  text-shadow: 0 2px 10px rgba(216, 125, 75, 0.3);
  font-family: 'Arial', sans-serif;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(44, 62, 80, 0.6);
  margin-top: 4px;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 漂浮健康小贴士 */
.floating-tips {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}

.tip-item {
  position: absolute;
  padding: 10px 18px;
  background: rgba(237, 228, 216, 0.7);
  border-radius: 25px;
  font-size: 0.85rem;
  color: #5a4a3a;
  box-shadow: 0 4px 15px rgba(205, 154, 103, 0.15);
  border: 1px solid rgba(205, 154, 103, 0.2);
  animation: floatTip 6s ease-in-out infinite;
  white-space: nowrap;
  backdrop-filter: blur(5px);
}

@keyframes floatTip {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-15px) scale(1.02);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.fullscreen-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.4s ease;
}

.fs-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: scaleIn 0.4s ease;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* 图片全屏查看 */
.fullscreen-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.4s ease;
}

.fs-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.4s ease;
}

/* 淡入淡出动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 过渡动画样式 */
.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #faf6f1 100%);
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.2s ease;
}

.transition-overlay.active {
  opacity: 1;
  pointer-events: all;
}

.transitioning .three-canvas {
  transition: opacity 1s ease;
  opacity: 0;
}

.fade-out {
  animation: fadeOutUp 1s ease forwards !important;
}

@keyframes fadeOutUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.title-overlay.fade-out,
.stats-overlay.fade-out,
.floating-tips.fade-out,
.hint-text.fade-out {
  animation: fadeOutUp 0.8s ease forwards;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .sub-title {
    font-size: 0.9rem;
  }
  
  .hint-text span {
    font-size: 0.75rem;
  }
  
  .tooltip {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .stats-overlay {
    top: 15%;
    right: 3%;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .tip-item {
    font-size: 0.75rem;
    padding: 8px 14px;
  }
  
  .floating-tips .tip-item:nth-child(n+4) {
    display: none;
  }
}
</style>
