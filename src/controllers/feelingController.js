import { getAllFeeling } from "../services/feelingService.js";

const getAllFeelings = async (req, res, next) => {
  try {
    const result = await getAllFeeling();

    res.status(200).json({
      message: "successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllFeelings;
