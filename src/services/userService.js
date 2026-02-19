import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import profilePath from "../utils/filePath.js";
import uploadUserAsset from "../services/uploadFileService.js";

const getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      streaks: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  let streaks = user.streaks;
  let displayStreak = 0;
  if (user.streaks.length > 0) {
    const streak = user.streaks[0];
    const lastLogDate = new Date(streak.endDate);
    const today = new Date();

    const diffTime = Math.abs(today - lastLogDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) {
      displayStreak = streak.length;
    }
  }

  return { user, displayStreak, streaks };
};

const updatePhotoProfile = async (email, file) => {
  const fileName = `profile_${Date.now()}.jpg`;
  const filePath = profilePath(email, fileName);

  const uploadResult = await uploadUserAsset(file, filePath);
  return uploadResult;
};

const updateProfile = async (userId, username, file) => {
  try {
    let photoUrl;
    if (file) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) throw new NotFoundError("User Not Found");

      const photoResult = await updatePhotoProfile(user.email, file);
      photoUrl = photoResult.url;
    }

    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username,
        photo_profile: photoUrl,
      },
    });

    return userUpdate;
  } catch (error) {
    if (error.code === "P2025") {
      throw new NotFoundError("User Not Found");
    }
    throw error;
  }
};

export default { getMyProfile, updateProfile, updatePhotoProfile };
