import prisma from "../database/prisma.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import streakService from "./streakService.js";

const getMood = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return await prisma.moodLog.findMany({
    where: { userId },
    include: {
      moodLogTags: true,
    },
  });
};

const createMood = async (
  userId,
  journalNote,
  logDate,
  moodTypeId,
  feelingTagIds,
) => {
  const tagConnections = feelingTagIds.map((tagId) => ({
    feelingTagId: tagId,
  }));

  const newLog = await prisma.moodLog.create({
    data: {
      userId,
      moodTypeId: moodTypeId,
      logDate: new Date(logDate),
      journalNote,

      moodLogTags: {
        create: tagConnections,
      },
    },

    include: {
      moodLogTags: {
        include: {
          feelingTag: true,
        },
      },
    },
  });

  const streak = await streakService.calculateStreak(userId, logDate);

  return {
    newLog,
    streak,
  };
};

const deleteMood = async (id) => {
  return await prisma.moodLog.delete({ where: { id } });
};

const updateMood = async (
  id,
  moodTypeId,
  logDate,
  journalNote,
  feelingTagIds,
) => {
  const updateData = {};

  if (journalNote !== undefined) updateData.journalNote = journalNote;

  if (moodTypeId) updateData.moodTypeId = parseInt(moodTypeId);
  if (logDate) updateData.logDate = new Date(logDate);

  if (feelingTagIds && Array.isArray(feelingTagIds)) {
    updateData.moodLogTags = {
      deleteMany: {},

      create: feelingTagIds.map((tagId) => ({
        feelingTagId: parseInt(tagId),
      })),
    };
  }

  const updatedLog = await prisma.moodLog.update({
    where: { id: id },
    data: updateData,
    include: {
      moodType: true,
      moodLogTags: {
        include: {
          feelingTag: true,
        },
      },
    },
  });

  return updatedLog;
};

export default {
  getMood,
  createMood,
  deleteMood,
  updateMood,
};
