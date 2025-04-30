import {
  DashboardDailyType,
  DashboardMonthlyType,
} from "@/features/dashboard/dashboard.types";
import { Model, model, models, Schema, Document } from "mongoose";

export interface DashboardDailyModel extends Document, DashboardDailyType {
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMonthlyModel extends Document, DashboardMonthlyType {
  createdAt: Date;
  updatedAt: Date;
}

const TopProductSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sold: { type: Number, required: true, min: 0 },
    productUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { _id: false },
);

// Dashboard Daily
const dashboardDailySchema = new Schema<DashboardDailyModel>(
  {
    date: { type: Date, required: true },
    totalCompletedRevenue: { type: Number, required: true, min: 0 },
    totalConfirmedRevenue: { type: Number, required: true, min: 0 },
    totalConfirmedOrders: { type: Number, required: true, min: 0 },
    totalCompletedOrders: { type: Number, required: true, min: 0 },
    totalNewUsers: { type: Number, required: true, min: 0 },
    totalViews: { type: Number, required: true, min: 0, default: 0 },
    topProducts: { type: [TopProductSchema], default: [] },
  },
  { timestamps: true },
);

dashboardDailySchema.index({ date: 1 }, { unique: true });

// Dashboard Monthly
const dashboardMonthlySchema = new Schema<DashboardMonthlyModel>(
  {
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    totalCompletedRevenue: { type: Number, required: true, min: 0 },
    totalConfirmedRevenue: { type: Number, required: true, min: 0 },
    totalConfirmedOrders: { type: Number, required: true, min: 0 },
    totalCompletedOrders: { type: Number, required: true, min: 0 },
    totalNewUsers: { type: Number, required: true, min: 0 },
    totalViews: { type: Number, required: true, min: 0, default: 0 },
    topProducts: { type: [TopProductSchema], default: [] },
  },
  { timestamps: true },
);

dashboardMonthlySchema.index({ month: 1 }, { unique: true });

export const DashboardDaily =
  (models.DashboardDaily as Model<DashboardDailyModel>) ||
  model<DashboardDailyModel>("DashboardDaily", dashboardDailySchema);

export const DashboardMonthly =
  (models.DashboardMonthly as Model<DashboardMonthlyModel>) ||
  model<DashboardMonthlyModel>("DashboardMonthly", dashboardMonthlySchema);
