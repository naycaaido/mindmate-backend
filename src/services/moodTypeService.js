import prisma from "../database/prisma.js";

const getMoodType = async () => {
  const result = await prisma.moodType.findMany();

  return result;
};

export default getMoodType;
