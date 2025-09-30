import { model, Schema, Types } from "mongoose";

export interface ISkill {
    _id?: Types.ObjectId;
    skill: string;
    level: string;
    logo: string;
    category: Types.ObjectId;
}

const SkillSchema = new Schema<ISkill>({
  skill: { type: String, required: true },
  level: { type: String, required: true },
  logo: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "SkillCategory" },
});

export const Skill = model<ISkill>("Skill", SkillSchema);