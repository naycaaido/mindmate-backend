import prisma from "../database/prisma.js";

const calculateStreak = async (userId, logDateInput) => {
  const today = new Date(logDateInput);
  today.setHours(0, 0, 0, 0);

  const activeStreak = await prisma.userStreak.findFirst({
    where: {
      userId: userId,
      isActive: true,
    },
  });

  if (!activeStreak) {
    return await prisma.userStreak.create({
      data: {
        userId,
        startDate: today,
        endDate: today,
        length: 1,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  const lastLogDate = new Date(activeStreak.endDate);
  lastLogDate.setHours(0, 0, 0, 0);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((today - lastLogDate) / oneDay);

  if (diffDays === 0) {
    return activeStreak;
  }

  if (diffDays === 1) {
    return await prisma.userStreak.update({
      where: { id: activeStreak.id },
      data: {
        length: { increment: 1 },
        endDate: today,
        updatedAt: new Date(),
      },
    });
  }

  if (diffDays > 1) {
    await prisma.userStreak.update({
      where: { id: activeStreak.id },
      data: { isActive: false },
    });

    return await prisma.userStreak.create({
      data: {
        userId,
        startDate: today,
        endDate: today,
        length: 1,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }
};

export default { calculateStreak };
