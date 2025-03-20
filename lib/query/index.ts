import "server-only";

import SafeQuery from "../safe-query";

export const safeQuery = new SafeQuery({
  errorHandler: (error) => {
    console.log(error);
  },
});
