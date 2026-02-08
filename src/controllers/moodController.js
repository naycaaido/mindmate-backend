import moodService from "../services/moodService.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const getMood = async (req, res, next) => {
  try {
    const userId = req.user;

    if (!userId) {
      throw new NotFoundError("user id not found");
    }

    const userNote = await moodService.getMood(userId);

    res.json({
      message: "successfuly getting all data",
      data: userNote,
    });
  } catch (error) {
    next(error);
  }
};

const createMood = async (req, res, next) => {
  try {
    const { journalNote, moodTypeId, feelingTagIds, logDate } = req.body;
    const userId = req.user;

    const newMood = await moodService.createMood(
      userId,
      journalNote,
      logDate,
      moodTypeId,
      feelingTagIds,
    );

    res.status(201).json({ message: "Catatan berhasil dibuat", data: newMood });
  } catch (error) {
    next(error);
  }
};

const deleteMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    await moodService.deleteMood(id);

    res.json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

const updateMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { moodTypeId, logDate, journalNote, feelingTagIds } = req.body;
    const updated = await moodService.updateMood(
      id,
      moodTypeId,
      logDate,
      journalNote,
      feelingTagIds,
    );
    res.json({ message: "Catatan berhasil diperbarui", data: updated });
  } catch (error) {
    next(error);
  }
};

export default {
  getMood,
  createMood,
  deleteMood,
  updateMood,
};
