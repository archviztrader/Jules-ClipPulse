import { createTRPCRouter } from './server'
import { videoRouter } from './routers/video'
import { billingRouter } from './routers/billing'

export const appRouter = createTRPCRouter({
  video: videoRouter,
  billing: billingRouter,
})

export type AppRouter = typeof appRouter