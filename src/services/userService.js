import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";

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

  return { user, displayStreak };
};

const updateProfile = async (userId, username) => {
  try {
    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return userUpdate;
  } catch (error) {
    if (
      error instanceof prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("User Not Found");
    }
    throw error;
  }
};

export default { getMyProfile, updateProfile };
