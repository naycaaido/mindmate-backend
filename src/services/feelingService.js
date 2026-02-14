import prisma from "../database/prisma.js";

const getAllFeeling = async () => {
  const result = await prisma.feelingTag.findMany();

  return result;
};

export { getAllFeeling };
