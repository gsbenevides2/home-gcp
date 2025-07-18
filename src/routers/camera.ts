import express from 'express'
import fs from 'fs'
import path from 'path'
import { Cameras, type CameraName } from '../clients/Camera/CamerasSingleton'

const router = express.Router()

// Rota para o arquivo de playlist HLS
router.get('/cameras-service/:cameraName/playlist.m3u8', async (req, res) => {
  try {
    const cameraName = req.params.cameraName
    const camera = await Cameras.getInstance().getCamera(
      cameraName as CameraName
    )
    if (!camera) {
      return res.status(404).send('Camera not found')
    }
    const hlsManager = camera.hlsStream

    // Verificar se é uma solicitação explícita de stream atualizado
    const forceRefresh = req.query.refresh === 'true'

    if (forceRefresh) {
      //await hlsManager.forceRefresh()
    }

    // Iniciar o HLS manager se não estiver rodando
    if (!hlsManager.isRunning()) {
      //hlsManager.start()

      // Aguardar um pouco para verificar se o arquivo foi criado
      setTimeout(() => {
        if (fs.existsSync(hlsManager.playlistPath)) {
          res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
          res.set('Pragma', 'no-cache')
          res.set('Expires', '0')
          res.sendFile(hlsManager.playlistPath)
        } else {
          res
            .status(503)
            .send(
              'Playlist não disponível ainda. Tente novamente em instantes.'
            )
        }
      }, 2000)
    } else {
      // Se já está rodando, enviar o arquivo da playlist
      if (fs.existsSync(hlsManager.playlistPath)) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.set('Pragma', 'no-cache')
        res.set('Expires', '0')
        res.sendFile(hlsManager.playlistPath)
      } else {
        res
          .status(503)
          .send('Playlist não disponível ainda. Tente novamente em instantes.')
      }
    }
  } catch {
    res.status(500).send('Erro interno')
  }
})

// Rota para obter uma imagem estática (snapshot) da câmera
router.get('/cameras-service/:cameraName/snapshot.jpg', async (req, res) => {
  try {
    const cameraName = req.params.cameraName
    const camera = await Cameras.getInstance().getCamera(
      cameraName as CameraName
    )
    if (!camera) {
      return res.status(404).send('Camera not found')
    }
    // Usar fetch para obter a imagem diretamente da câmera
    const response = await fetch(camera.getSnapshotUrl())

    if (!response.ok) {
      throw new Error(`Erro na resposta: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const data = Buffer.from(buffer)

    // Enviar a imagem para o cliente
    res.set('Content-Type', 'image/jpeg')
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.send(data)
  } catch {
    res.status(500).send('Erro ao obter imagem da câmera')
  }
})

// Servir os arquivos de segmento
router.get('/cameras-service/:cameraName/:filename', async (req, res) => {
  try {
    const cameraName = req.params.cameraName
    const camera = await Cameras.getInstance().getCamera(
      cameraName as CameraName
    )
    if (!camera) {
      return res.status(404).send('Camera not found')
    }
    const hlsManager = camera.hlsStream
    const filename = req.params.filename
    if (!filename.endsWith('.ts') && !filename.endsWith('.m3u8')) {
      return res.status(403).send('Acesso negado')
    }

    const filePath = path.join(hlsManager.hlsDir, filename)
    if (fs.existsSync(filePath)) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.set('Pragma', 'no-cache')
      res.set('Expires', '0')
      res.sendFile(filePath)
    } else {
      res.status(404).send('Arquivo não encontrado')
    }
  } catch {
    res.status(500).send('Erro interno')
  }
})

router.post('/cameras-service/:cameraName/up', async (req, res) => {
  const cameraName = req.params.cameraName
  const camera = await Cameras.getInstance().getCamera(cameraName as CameraName)
  if (!camera) {
    return res.status(404).send('Camera not found')
  }
  await camera.up()
  res.status(200).send('Camera moved up')
})

router.post('/cameras-service/:cameraName/down', async (req, res) => {
  const cameraName = req.params.cameraName
  const camera = await Cameras.getInstance().getCamera(cameraName as CameraName)
  if (!camera) {
    return res.status(404).send('Camera not found')
  }
  await camera.down()
  res.status(200).send('Camera moved down')
})

router.post('/cameras-service/:cameraName/left', async (req, res) => {
  const cameraName = req.params.cameraName
  const camera = await Cameras.getInstance().getCamera(cameraName as CameraName)
  if (!camera) {
    return res.status(404).send('Camera not found')
  }
  await camera.left()
  res.status(200).send('Camera moved left')
})

router.post('/cameras-service/:cameraName/right', async (req, res) => {
  const cameraName = req.params.cameraName
  const camera = await Cameras.getInstance().getCamera(cameraName as CameraName)
  if (!camera) {
    return res.status(404).send('Camera not found')
  }
  await camera.right()
  res.status(200).send('Camera moved right')
})
export default router
