import { CacheHandler } from "@neshca/cache-handler";
import createLocalHandler from "@neshca/cache-handler/local-lru";
// import { createClient } from 'redis';
// import createRedisHandler from '@neshca/cache-handler/redis-strings';

CacheHandler.onCreation(async () => {
  // Let's imagine we're using a map
  // in which values are shared via the network
  // between all your Next.js app instances.

  // const client = createClient(clientOptions);
  //
  // await client.connect();

  // const redisHandler = createRedisHandler({
  //   client,
  //   keyPrefix: "prefix:",
  //   timeoutMs: 1000,
  //   keyExpirationStrategy: "EXAT",
  //   sharedTagsKey: "__sharedTags__",
  //   revalidateTagQuerySize: 100,
  // });

  const localHandler = createLocalHandler({
    maxItemsNumber: 10000,
    maxItemSizeBytes: 1024 * 1024 * 50, // 5MB
  });

  // should be: handlers: [redisHandler, localHandler]
  return {
    handlers: [localHandler],
  };
});

export default CacheHandler;
