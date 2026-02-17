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
    const userId = req.user;
    const { username } = req.body;

    const result = await userService.updateProfile(userId, username);

    return res.status(200).json({
      message: "successfuly updating user profile",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { getMyProfile, updateProfile };
