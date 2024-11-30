#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (e) {
    console.error(`Failed to exec ${command}`, e)
    return false
  }
  return true
}

const repoName = process.argv[2]
if (!repoName) {
  console.error('Project name must be provided.')
  process.exit(1)
}

const projectDir = path.join(process.cwd(), repoName)

if (fs.existsSync(projectDir)) {
  console.error(`The directory '${repoName}' already exists.`)
  console.log(
    'Please choose a different name or delete the existing directory.'
  )
  process.exit(1)
}

const gitCheckoutCommand = `git clone --depth 1 https://github.com/araryarch/next-chatbot-kit ${repoName}`
const installDepsCommand = `cd ${repoName} && bun install`

console.log(`Cloning the repository with name ${repoName}`)
const checkOut = runCommand(gitCheckoutCommand)
if (!checkOut) process.exit(-1)

console.log(`Installing dependencies for ${repoName}`)
const installedDeps = runCommand(installDepsCommand)
if (!installedDeps) process.exit(-1)

console.log('Congrats! Your chatbot project is ready!')
console.log(`cd ${repoName} to start working on it.`)
