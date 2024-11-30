#!/usr/bin/env node

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const repoUrl = 'https://github.com/araryarch/next-chatbot-kit.git'

const projectName = process.argv[2] || 'next-chatbot-kit'

const projectDir = path.join(process.cwd(), projectName)

if (fs.existsSync(projectDir)) {
  console.log(`Proyek ${projectName} sudah ada!`)
  process.exit(1)
}

console.log(`Meng-clone repo dari ${repoUrl}...`)
try {
  execSync(`git clone ${repoUrl} ${projectDir}`, { stdio: 'inherit' })

  console.log(`Proyek ${projectName} berhasil dibuat!`)

  const gitDir = path.join(projectDir, '.git')
  if (fs.existsSync(gitDir)) {
    fs.rmdirSync(gitDir, { recursive: true })
    console.log('.git folder dihapus untuk memulai dari awal')
  }

  console.log('Instalasi selesai. Anda bisa mulai mengerjakan proyek chatbot!')
} catch {
  console.error('Terjadi kesalahan saat meng-clone repo:')
}
