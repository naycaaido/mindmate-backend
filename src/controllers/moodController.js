import moodService from "../services/moodService.js";

const getMood = async (req, res) => {
  try {
    const { userId } = req.body;
    const userNote = await moodService.getMood(req.body);
    console.log(userNote);
    res.json({ userNote });
  } catch (error) {
    console.error(error);
    console.error(error.meta);
    res.status(404).json({ message: "Catatan tidak ditemukan" });
  }
};

const createMood = async (req, res) => {
  try {
    const {
      userId,
      recommendedContentId,
      journalNote,
      moodTypeId,
      feelingTagId,
    } = req.body;
    const newMood = await moodService.createMood(req.body);
    res.json({ message: "Catatan berhasil dibuat", data: newMood });
  } catch (error) {
    console.error(error);
    console.error(error.meta);
    console.log(req.body);
    res.status(500).json({ message: "Catatan gagal dibuat" });
  }
};

const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    await moodService.deleteMood(req.params);
    res.json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    console.error(error.meta);
    res.status(500).json({ message: "Catatan gagal dihapus " });
  }
};

const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { journalNote, moodTypeId, feelingTagId } = req.body;
    const updated = await moodService.updateMood(req.params, req.body);
    res.json({ message: "Catatan berhasil diperbarui", data: updated });
  } catch (error) {
    console.error(error);
    console.error(error.meta);
    res.status(500).json({ message: "Catatan gagal diperbarui" });
  }
};

export default {
  getMood,
  createMood,
  deleteMood,
  updateMood,
};
