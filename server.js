require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

const upload = multer({ dest: 'uploads/' })
const app = express()
const PORT = process.env.PORT || 3000

const BOT_TOKEN = process.env.BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false })

  try {
    const form = new FormData()
    form.append('chat_id', CHAT_ID)
    form.append('photo', fs.createReadStream(req.file.path))

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`
    const r = await axios.post(url, form, { headers: form.getHeaders() })

    fs.unlink(req.file.path, () => {})

    res.json({ ok: true, data: r.data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ ok: false })
  }
})

app.use(express.static('public'))

app.listen(PORT, () => console.log('Server running on', PORT))
