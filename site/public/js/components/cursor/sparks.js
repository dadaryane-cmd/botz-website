import { h } from '../../lib/dom.js'
import { SPARK, newSparks, sparkOpacity, stepSparks } from '../../lib/sparks.js'

/** The fire's colours: light yellow, amber and the brand's red. */
const SPARK_COLORS = ['#ffd27a', '#ff9f1c', '#ea4823']
/** A frame longer than this (a busy or hidden tab) is counted as this long. */
const LONGEST_FRAME_MS = 50

/**
 * A few sparks fall behind the mouse when it moves fast, and fade in half a second (the home
 * page, next to its fire). The canvas is drawn only while sparks are alive.
 */
export function startSparks() {
  const canvas = h('canvas', { class: 'cursor-sparks', 'aria-hidden': 'true' })
  document.body.append(canvas)
  const context = canvas.getContext('2d')

  let sparks = []
  let lastMove = null
  let frame = 0
  let lastFrameTime = 0

  const fitToWindow = () => {
    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.round(innerWidth * ratio)
    canvas.height = Math.round(innerHeight * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  const draw = (now) => {
    const elapsed = lastFrameTime ? Math.min(now - lastFrameTime, LONGEST_FRAME_MS) : 16
    lastFrameTime = now
    sparks = stepSparks(sparks, elapsed)
    context.clearRect(0, 0, innerWidth, innerHeight)
    for (const spark of sparks) {
      context.globalAlpha = sparkOpacity(spark)
      context.fillStyle = spark.color
      context.beginPath()
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
      context.fill()
    }
    frame = sparks.length > 0 ? requestAnimationFrame(draw) : 0
    if (!frame) lastFrameTime = 0
  }

  const onMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const move = { x: event.clientX, y: event.clientY, time: event.timeStamp }
    if (lastMove) {
      const distance = Math.hypot(move.x - lastMove.x, move.y - lastMove.y)
      const speed = distance / Math.max(1, move.time - lastMove.time)
      const born = newSparks({ x: move.x, y: move.y, speed }).map((spark) => ({
        ...spark,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      }))
      sparks = [...sparks, ...born].slice(-SPARK.max)
      if (sparks.length > 0 && !frame) frame = requestAnimationFrame(draw)
    }
    lastMove = move
  }

  fitToWindow()
  window.addEventListener('resize', fitToWindow, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
}
