import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { generateApi } from 'swagger-typescript-api'

const defaultSpec = new URL('../../../Лр4/tco-backend/docs/swagger.json', import.meta.url)
const source = process.argv[2] ?? defaultSpec
const spec = JSON.parse(await readFile(source, 'utf8'))

const operations = {
  '/api/life_cycle_stages': { get: 'listLifeCycleStages', post: 'createLifeCycleStage' },
  '/api/life_cycle_stages/feed': { get: 'getLifeCycleStageFeed' },
  '/api/life_cycle_stages/draft': { get: 'getDraftLifeCycleStage' },
  '/api/life_cycle_stages/{id}': { delete: 'deleteLifeCycleStage' },
  '/api/life_cycle_stages/{id}/like': { post: 'likeLifeCycleStage' },
  '/api/life_cycle_stages/{id}/publish': { put: 'publishLifeCycleStage' },
}
for (const [path, methods] of Object.entries(operations)) {
  for (const [method, name] of Object.entries(methods)) {
    spec.paths[path][method].operationId = name
  }
}

await generateApi({
  spec,
  fileName: 'Api.ts',
  output: fileURLToPath(new URL('../src/api/', import.meta.url)),
  httpClientType: 'axios',
  unwrapResponseData: true,
})
