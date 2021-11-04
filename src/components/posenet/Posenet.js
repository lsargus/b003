import React, {Component} from 'react'
import backend from '@tensorflow/tfjs-backend-webgl'
import * as posenet from "@tensorflow-models/posenet";
import { drawKeyPoints, drawSkeleton } from "./PosenetUtil";
import { acenderLamp, apagarLamp } from "./PostmanRequests"
import "./posenetStyle.css";

var sendRequest = false;
var timer;

class Posenet extends Component  {
  static defaultProps = {
    videoWidth: 900,
    videoHeight: 700,
    flipHorizontal: true,
    algorithm: 'single-pose',
    showVideo: true,
    showSkeleton: false,
    showPoints: true,
    ignorePoints: [0,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16],
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 16,
    imageScaleFactor: 0.5,
    skeletonColor: '#1389eb',
    skeletonLineWidth: 6,
    loadingText: 'Carregando...',
    circleRadius: 50
  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  getPosX = elem => {
    this.posX = elem
  }

  getPosY = elem => {
    this.posY = elem
  }

  async componentDidMount() {
    try {
      await this.setupCamera()
    } catch (error) {
      throw new Error(
        'This browser does not support video capture, or this device does not have a camera'
      )
    }

    try {
      /*this.posenet = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        quantBytes: 1
      })*/

      this.posenet = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75
      })
    } catch (error) {
      throw new Error('PoseNet failed to load' + error)
    } finally {
      setTimeout(() => {
        this.setState({loading: false})
      }, 200)
    }

    this.detectPose()
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }
    const {videoWidth, videoHeight} = this.props
    const video = this.video
    video.width = videoWidth
    video.height = videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
      }
    })

    video.srcObject = stream

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')

    canvas.width = videoWidth
    canvas.height = videoHeight

    this.poseDetectionFrame(canvasContext)
  }

  poseDetectionFrame(canvasContext) {
    const {
      algorithm,
      imageScaleFactor, 
      flipHorizontal, 
      outputStride, 
      minPoseConfidence, 
      minPartConfidence, 
      maxPoseDetections, 
      nmsRadius, 
      videoWidth, 
      videoHeight, 
      showVideo, 
      showPoints,
      ignorePoints,
      showSkeleton, 
      skeletonColor, 
      skeletonLineWidth,
      circleRadius
      } = this.props

    const posenetModel = this.posenet
    const video = this.video

    const findPoseDetectionFrame = async () => {
      let poses = []

      switch (algorithm) {
        case 'multi-pose': {
          poses = await posenetModel.estimateMultiplePoses(
          video, {
          imageScaleFactor, 
          flipHorizontal, 
          outputStride, 
          maxPoseDetections, 
          minPartConfidence, 
          nmsRadius })
          break
        }
        case 'single-pose': {
          const pose = await posenetModel.estimateSinglePose(
          video, {
          imageScaleFactor, 
          flipHorizontal, 
          outputStride })
          poses.push(pose)
          break
        }
      }

      canvasContext.clearRect(0, 0, videoWidth, videoHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.scale(-1, 1)
        canvasContext.translate(-videoWidth, 0)
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
        canvasContext.restore()
      }
      
      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              ignorePoints,
              canvasContext
            )
          }
          if (showSkeleton) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            )
          }
        }

        // identifica pulso esquerdo
        if (parseFloat(keypoints[9].score) > minPoseConfidence) {
          const maoEsquerda = keypoints[9].position
          this.posX.value = maoEsquerda.x
          this.posY.value = maoEsquerda.y

          let targetX = 450
          let targetY = 450

          let distSim = Math.sqrt(Math.pow((maoEsquerda.x - targetX),2) + Math.pow((maoEsquerda.y - targetY),2))

          targetX = 350

          let distNao = Math.sqrt(Math.pow((maoEsquerda.x - targetX),2) + Math.pow((maoEsquerda.y - targetY),2))

          this.timerRequest(maoEsquerda.x, maoEsquerda.y, 9, distSim, distNao)
        }

      })
      this.drawCanvas(canvasContext, circleRadius)
      requestAnimationFrame(findPoseDetectionFrame)
    }
    
    findPoseDetectionFrame()
  }

  drawCanvas(canvasContext, circleRadius) {
    // circulo sim
    canvasContext.beginPath()
    canvasContext.arc(450, 450, circleRadius, 0, 2 * Math.PI)
    canvasContext.strokeStyle = "#24FC03"
    canvasContext.lineWidth = 5
    canvasContext.stroke()

    // circulo não
    canvasContext.beginPath()
    canvasContext.arc(350, 450, circleRadius, 0, 2 * Math.PI)
    canvasContext.strokeStyle = "#FC1703"
    canvasContext.lineWidth = 5
    canvasContext.stroke()
  }

  timerRequest(x, y, codParte, distSim, distNao) {
    if (!sendRequest && distSim < 50) {
      timer = setTimeout(acenderLamp(x,y,codParte), 2000)
      sendRequest = true
    }
    if (!sendRequest && distNao < 50) {
      timer = setTimeout(apagarLamp(x,y,codParte), 2000)
      sendRequest = true
    }
    if (distSim >= 50 && distNao >= 50) {
      clearTimeout(timer)
      sendRequest = false
    }
 }
  

  render() {
    return (
      <div>
        <div>
          <video id="videoNoShow" playsInline ref={this.getVideo} />
          <canvas className="webcam" ref={this.getCanvas} />
          <div id="pulsoEsquerdo">
            <output name="posX" ref={this.getPosX}></output>
            <output name="posY" ref={this.getPosY}></output>
          </div>
        </div>
      </div>
    )
  }
}

export default Posenet
