import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve('public/images')
await mkdir(outDir, { recursive: true })

const jobs = [
  // Prefer GoLive app card art when available; else Live Nation heroes.
  {
    name: 'lany.jpg',
    url: process.env.LANY_URL,
  },
  {
    name: 'weeknd.jpg',
    url: process.env.WEEKND_URL,
  },
  {
    name: 'khalid.jpg',
    url: process.env.KHALID_URL,
  },
  {
    name: 'yungkai.jpg',
    url: process.env.YUNGKAI_URL,
  },
  {
    name: 'post.jpg',
    url: process.env.POST_URL,
  },
  {
    name: 'niki.jpg',
    url: process.env.NIKI_URL,
  },
  {
    name: 'comedy1.jpg',
    url: process.env.COMEDY1_URL,
  },
  {
    name: 'comedy2.jpg',
    url: process.env.COMEDY2_URL,
  },
]

for (const job of jobs) {
  if (!job.url) {
    console.log('skip', job.name)
    continue
  }
  const res = await fetch(job.url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })
  if (!res.ok) throw new Error(`${job.name} HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const out = path.join(outDir, job.name)
  await sharp(buf)
    .rotate()
    .resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out)
  console.log('saved', job.name, buf.length)
}
