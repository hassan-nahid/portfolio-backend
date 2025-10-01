import { About, IAbout } from "./about.model";
import AppError from "../../errorHelpers/AppError";

const createAbout = async (payload: Partial<IAbout>): Promise<IAbout> => {
  // Check if an about record already exists
  const existingAbout = await About.findOne({});
  
  if (existingAbout) {
    throw new AppError(409, "About section already exists. Only one about record is allowed. Please update the existing record instead.");
  }

  const about = await About.create(payload);
  return about;
};

const getAbout = async (): Promise<IAbout | null> => {
  const about = await About.findOne({});
  return about;
};

const getAboutById = async (id: string): Promise<IAbout> => {
  const about = await About.findById(id);
  
  if (!about) {
    throw new AppError(404, "About section not found");
  }
  
  return about;
};

const updateAbout = async (
  id: string,
  payload: Partial<IAbout>
): Promise<IAbout> => {
  const about = await About.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  if (!about) {
    throw new AppError(404, "About section not found");
  }

  return about;
};

const updateAboutDirect = async (payload: Partial<IAbout>): Promise<IAbout> => {
  // Find the existing about record and update it
  let about = await About.findOne({});
  
  if (!about) {
    throw new AppError(404, "About section not found. Please create one first.");
  }

  about = await About.findByIdAndUpdate(
    about._id,
    payload,
    { new: true, runValidators: true }
  );

  if (!about) {
    throw new AppError(404, "Failed to update about section");
  }

  return about;
};

const deleteAbout = async (id: string): Promise<void> => {
  const about = await About.findByIdAndDelete(id);
  
  if (!about) {
    throw new AppError(404, "About section not found");
  }
};

const deleteAboutDirect = async (): Promise<void> => {
  const about = await About.findOneAndDelete({});
  
  if (!about) {
    throw new AppError(404, "About section not found");
  }
};

export const AboutService = {
  createAbout,
  getAbout,
  getAboutById,
  updateAbout,
  updateAboutDirect,
  deleteAbout,
  deleteAboutDirect
};
