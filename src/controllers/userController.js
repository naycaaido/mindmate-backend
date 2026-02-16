import prisma from "../database/prisma.js";

const getMyProfile = async (req, res) => {
  const userId = req.user;
  console.log(userId);

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

  return res.json({
    data: {
      username: user.username,
      email: user.email,
      currentStreak: {
        length: displayStreak,
        startDate: user.streaks.startDate,
        endDate: user.streaks.endDate,
      },
      photoUrl: user.photo_profile,
    },
  });
};

export default { getMyProfile };
