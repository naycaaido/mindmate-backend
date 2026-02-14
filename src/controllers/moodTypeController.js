import getMoodType from "../services/moodTypeService.js";

const getAllMoodType = async (req, res, next) => {
  try {
    const result = await getMoodType();

    res.status(200).json({
      message: "successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllMoodType;
