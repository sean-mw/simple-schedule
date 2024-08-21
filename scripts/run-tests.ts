/* eslint-disable @typescript-eslint/no-var-requires */

const { exec, spawn } = require('child_process')
const { promisify } = require('util')
const { existsSync } = require('fs')
const path = require('path')

require('dotenv').config()

const execAsync = promisify(exec)

const composePath = path.resolve(__dirname, '../prisma/compose.yml')

const startDatabase = async () => {
  try {
    console.log('Starting database...')
    await execAsync('npm run db:start')
    console.log('Database started successfully.')
  } catch (error) {
    console.error('Error starting database:', error)
    process.exit(1)
  }
}

const stopDatabase = async () => {
  try {
    console.log('Stopping database...')
    await execAsync('npm run db:stop')
    console.log('Database stopped successfully.')
  } catch (error) {
    console.error('Error stopping database:', error)
  }
}

const runTests = async () => {
  return new Promise<void>((resolve) => {
    console.log('Running tests with Jest...')

    const jest = spawn('npx', ['jest'], { stdio: 'inherit' })

    jest.on('close', (code: number) => {
      if (code === 0) {
        console.log('Tests completed.')
      } else {
        console.error('Tests failed.')
      }
      resolve()
    })
  })
}

const main = async () => {
  if (!process.env.POSTGRES_PRISMA_URL?.includes('localhost:5432')) {
    console.error(
      [
        'Tests make modifications to the database.',
        'Please ensure that the POSTGRES_PRISMA_URL environment variable is set to a local test database.',
      ].join('\n')
    )
    process.exit(1)
  }

  if (!existsSync(composePath)) {
    console.error('Database compose.yml file not found.')
    process.exit(1)
  }

  await startDatabase()

  try {
    await runTests()
  } finally {
    await stopDatabase()
  }
}

main()
