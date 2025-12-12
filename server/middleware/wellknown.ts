import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  if (!pathname.startsWith('/.well-known/')) return

  const filePath = join(process.cwd(), 'public', pathname)

  try {
    const data = await fs.readFile(filePath)
    const ext = pathname.split('.').pop() || 'txt'
    const contentType = ext === 'json' ? 'application/json' : 'text/plain'
    setHeader(event, 'content-type', contentType)
    return data
  } catch {
    sendError(event, createError({ statusCode: 404, statusMessage: 'Not found' }))
  }
})
