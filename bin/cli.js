#!/usr/bin/env node

import { execSync } from 'child_process'

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' })
  } catch (e) {
    console.error(`failed to exec ${command}`, e)
    return false
  }
  return true
}

const repoName = process.argv[2]
const gitCheckoutCommand = `git clone --depth 1 https://github.com/araryarch/next-chatbot-kit ${repoName}`

const installDepsCommand = `cd ${repoName} && bun install`

console.log(`cloning the repository with name ${repoName}`)
const checkOut = runCommand(gitCheckoutCommand)
if (!checkOut) process.exit(-1)

console.log(`installing dependencies for ${repoName}`)

const installedDeps = runCommand(installDepsCommand)
if (!installedDeps) process.exit(-1)

console.log('Congrats')
console.log(`cd ${repoName}`)
