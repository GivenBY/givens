import { Schema, model, models } from "mongoose";

const UserAnalyticsSchema = new Schema(
  {
    userId: { type: String, required: true },
    totalPastes: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    popularLanguages: [
      {
        language: { type: String },
        count: { type: Number },
      },
    ],
    viewsOverTime: [
      {
        date: { type: String }, // YYYY-MM-DD
        views: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export const UserAnalyticsModel =
  models.UserAnalytics || model("UserAnalytics", UserAnalyticsSchema);
