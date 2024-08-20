/* eslint-disable @typescript-eslint/no-var-requires */

const { config } = require('dotenv')
const { execSync } = require('child_process')

config({ path: '.env.production' })
execSync('npx prisma migrate deploy', { stdio: 'inherit' })
