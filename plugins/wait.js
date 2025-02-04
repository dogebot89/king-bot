// https://github.com/zim-bot
// Drips Memes :)

const fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `Reply Photo/Send Photo With Caption ${usedPrefix}wait`
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Meme ${mime} not supported`
  let img = await q.download()
  await m.reply('Searching Anime Titles...')
  let anime = `data:${mime};base64,${img.toString('base64')}`
  let response = await fetch('https://trace.moe/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: anime }),
  })
  if (!response.ok) throw 'Image not found!'
  let result = await response.json()
  let { is_adult, title, title_chinese, title_romaji, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
  let link = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
  let nobuyaki = `
${similarity < 0.89 ? 'I Have Low Confidence About This' : ''}

🍋 Japanese title : *${title}*
🍋 Spelling Title : *${title_romaji}*
🍋 Similarity : *${(similarity * 100).toFixed(1)}%*
🍋 Episode : *${episode.toString()}*
🍋 Ecchi : *${is_adult ? 'Yes' : 'No'}*
`.trim()
  conn.sendFile(m.chat, link, 'srcanime.mp4', `${nobuyaki}`, m)
}
handler.help = ['wait (caption|reply image)']
handler.tags = ['tools']
handler.command = /^(wait)$/i

module.exports = handler
