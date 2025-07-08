import { Schema, model } from "mongoose";

const PasteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    views: { type: Number, default: 0 },

    // Authenticated user
    authorId: { type: String, default: null },
    authorName: { type: String, default: null },
    authorAvatar: { type: String, default: null },

    // Anonymous user
    anonEditId: { type: String, default: null },
  },
  { timestamps: true }
);

// Create the model
export const Paste = model("Paste", PasteSchema);

// Also export as PasteModel for backward compatibility
export const PasteModel = Paste;
