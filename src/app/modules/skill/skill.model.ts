import { model, Schema, Types } from "mongoose";

export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate", 
  EXPERIENCED = "Experienced",
  EXPERT = "Expert",
  GOOD = "Good",
  STRONG = "Strong",
  EXCELLENT = "Excellent"
}

export interface ISkill {
    _id?: Types.ObjectId;
    skill: string;
    level: SkillLevel;
    logo: string;
    category: Types.ObjectId;
}

const SkillSchema = new Schema<ISkill>({
  skill: { type: String, required: true },
  level: { 
    type: String, 
    required: true,
    enum: Object.values(SkillLevel)
  },
  logo: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "SkillCategory" },
});

export const Skill = model<ISkill>("Skill", SkillSchema);