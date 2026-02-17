import userService from "../services/userService.js";

const getMyProfile = async (req, res) => {
  try {
    // Pastikan req.user berisi ID yang benar. 
    // Biasanya middleware auth menyimpan payload di req.user.id
    const userId = req.user; 

    // PERBAIKAN 1: Tambahkan 'await' di sini
    const serviceResult = await userService.getMyProfile(userId);

    const { user, displayStreak } = serviceResult;

    return res.status(200).json({
      status: "success",
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

export default { getMyProfile };