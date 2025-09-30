import { Schema, model, Types } from "mongoose";

export interface ISkillCategory {
  _id?: Types.ObjectId;
  title: string; 
}

const SkillCategorySchema = new Schema<ISkillCategory>({
  title: { type: String, required: true },
});

export const SkillCategory = model<ISkillCategory>("SkillCategory", SkillCategorySchema);
