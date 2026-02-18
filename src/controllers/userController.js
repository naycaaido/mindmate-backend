import { type } from "os";
import userService from "../services/userService.js";

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user;

    const serviceResult = await userService.getMyProfile(userId);

    const { user, displayStreak } = serviceResult;

    return res.status(200).json({
      message: "succesfully getting user porfile",
      data: {
        username: user.username,
        email: user.email,
        currentStreak: {
          length: displayStreak,
          startDate: user.streaks?.startDate || null,
          endDate: user.streaks?.endDate || null,
        },
        photoUrl: user.photo_profile || user.photoUrl || null,
      },
    });
  } catch (error) {
    console.error("Error di getMyProfile:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user;

    const jsonParse = JSON.parse(req.body.data);
    const { username } = jsonParse;

    const file = req.file;

    if (!username && !file) {
      return res.status(400).json({
        message: "Tidak ada data yang dikirim untuk diperbarui",
      });
    }

    const result = await userService.updateProfile(userId, username, file);

    console.log(result);

    return res.status(200).json({
      message: "Successfully updating user profile",
      data: {
        id: result.id,
        username: result.username,
        photoUrl: result.photo_profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { getMyProfile, updateProfile };
