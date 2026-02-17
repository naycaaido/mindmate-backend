import prisma from "../database/prisma.js";

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

export default { getMyProfile };
