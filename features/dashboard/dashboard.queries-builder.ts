import { PipelineStage } from "mongoose";
import { Role } from "../authorization/authorization.constants";
import { OrderStatus } from "../orders/order.types";

const getCreatedAtOption = ({ from, to }: { from: Date; to: Date }) => {
  return {
    $gte: from,
    $lte: to,
  };
};

export const getTotalViewsMatchPipelineStage = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): PipelineStage.Match => ({
  $match: {
    createdAt: getCreatedAtOption({ from, to }),
  },
});

export const totalViewsGroupPipelineStage: PipelineStage.Group = {
  $group: {
    _id: null,
    totalViews: { $sum: "$totalViews" },
  },
};

export const getOrderMatchPipelineStage = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): PipelineStage.Match => ({
  $match: {
    completedAt: getCreatedAtOption({ from, to }),
    orderStatus: { $in: ["completed", "confirmed"] },
  },
});

export const orderGroupPipelineStage: PipelineStage.Group = {
  $group: {
    _id: "$orderStatus",
    totalRevenue: { $sum: "$total" },
    totalOrders: { $sum: 1 },
  },
};

export const getUserMatchPipelineStage = ({
  from,
  to,
  role,
}: {
  from: Date;
  to: Date;
  role: Role;
}): PipelineStage.Match => ({
  $match: {
    createdAt: getCreatedAtOption({ from, to }),
    role,
  },
});

export const userGroupPipelineStage: PipelineStage.Group = {
  $group: { _id: null, count: { $sum: 1 } },
};

export const getTopProductsPipelineStage = ({
  from,
  to,
  orderStatus = "confirmed",
}: {
  from: Date;
  to: Date;
  orderStatus?: OrderStatus;
}): PipelineStage.Match => ({
  $match: {
    completedAt: getCreatedAtOption({ from, to }),
    orderStatus,
  },
});

export const topProductsUnwindPipelineStage: PipelineStage.Unwind = {
  $unwind: "$items",
};

export const topProductsGroupPipelineStage: PipelineStage.Group = {
  $group: {
    _id: "$items.productId",
    productName: { $first: "$items.productName" },
    productUrl: { $first: "$items.productUrl" },
    imageUrl: { $first: "$items.imageUrl" },
    sold: { $sum: "$items.quantity" },
  },
};

export const topProductsProjectPipelineStage: PipelineStage.Project = {
  $project: {
    productId: { $toString: "$_id" },
    sold: 1,
    productName: 1,
    productUrl: 1,
    imageUrl: 1,
    _id: 0,
  },
};

export const topProductsSortPipelineStage: PipelineStage.Sort = {
  $sort: { sold: -1 },
};
