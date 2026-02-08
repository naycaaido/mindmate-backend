import prisma from "../database/prisma.js";

const getMood = async (userId) => {
  return await prisma.moodLog.findMany({
    where: userId,
    select: {
      id: true,
      userId: true,
      recommendedContentId: true,
      journalNote: true,
      logDate: true,
      createdAt: true,
      moodTypeId: true,
      feelingTagId: true,
    },
  });
};

const createMood = async (body) => {
  return await prisma.moodLog.create({
    data: {
      userId: body.userId,
      recommendedContentId: body.recommendedContentId,
      journalNote: body.journalNote,
      logDate: new Date(),
      createdAt: new Date(),
      moodTypeId: body.moodTypeId,
      feelingTagId: body.feelingTagId,
    },
  });
};

const deleteMood = async (id) => {
  return await prisma.moodLog.delete({ where: id });
};

const updateMood = async (id, body) => {
  return await prisma.moodLog.update({
    where: id,
    data: {
      journalNote: body.journalNote,
      feelingTagId: body.feelingTagId,
      moodTypeId: body.moodTypeId,
      logDate: new Date(),
    },
  });
};

export default {
  getMood,
  createMood,
  deleteMood,
  updateMood,
};
