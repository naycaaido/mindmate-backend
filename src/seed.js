import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function moodSeed(targetUserId) {
  console.log(
    `\n⏳ Creating 30 days of mood logs for user: ${targetUserId}...`,
  );

  // Hapus log lama untuk user ini agar tidak menumpuk jika di-run berkali-kali
  await prisma.moodLog.deleteMany({
    where: { userId: targetUserId },
  });

  // Helper untuk membuat tanggal mundur
  const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Skenario 30 Hari (Dari H-29 sampai H-0)
  // Pola: Santai -> Mulai Sibuk -> Stres/Burnout -> Recovery -> Sangat Bahagia
  const logScenarios = [
    // --- MINGGU 1: Awal Bulan (Santai & Positif) ---
    {
      daysAgo: 29,
      tagName: "Optimistic",
      note: "Awal bulan baru, semangat baru! Target bulan ini harus tercapai.",
    },
    {
      daysAgo: 28,
      tagName: "Calm",
      note: "Hari yang tenang. Mulai mencicil beberapa materi kuliah.",
    },
    {
      daysAgo: 27,
      tagName: "Focused",
      note: "Cukup produktif hari ini. Mengerjakan tugas coding sedikit-sedikit.",
    },
    {
      daysAgo: 26,
      tagName: "Comfortable",
      note: "Cuaca enak banget buat rebahan dan nonton series.",
    },
    {
      daysAgo: 25,
      tagName: "Sleepy",
      note: "Agak ngantuk seharian, tapi overall oke lah.",
    },
    {
      daysAgo: 24,
      tagName: "Relaxed",
      note: "Jalan-jalan sebentar cari udara segar bareng teman.",
    },
    {
      daysAgo: 23,
      tagName: "Happy",
      note: "Makan makanan favorit hari ini. Super kenyang dan senang!",
    },

    // --- MINGGU 2: Mulai Sibuk & Menurun ---
    {
      daysAgo: 22,
      tagName: "Okay",
      note: "Dosen mulai ngasih tugas besar. Harus mulai atur waktu.",
    },
    {
      daysAgo: 21,
      tagName: "Bored",
      note: "Bosen banget dengerin materi kelas hari ini.",
    },
    {
      daysAgo: 20,
      tagName: "Tired",
      note: "Tugas mulai menumpuk. Pulang ngampus langsung tepar.",
    },
    {
      daysAgo: 19,
      tagName: "Unmotivated",
      note: "Lagi males ngapa-ngapain, padahal deadline makin dekat.",
    },
    {
      daysAgo: 18,
      tagName: "Anxious",
      note: "Kepikiran project skripsi yang progresnya lambat.",
    },
    {
      daysAgo: 17,
      tagName: "Annoyed",
      note: "Laptop sempet ngehang pas lagi ngetik kode. Bikin kesel!",
    },
    {
      daysAgo: 16,
      tagName: "Sad",
      note: "Merasa kurang maksimal ngerjain tugas hari ini.",
    },

    // --- MINGGU 3: Titik Terendah (Burnout / Stres) ---
    {
      daysAgo: 15,
      tagName: "Panicked",
      note: "Deadline sisa 3 hari lagi dan backend belum selesai!",
    },
    {
      daysAgo: 14,
      tagName: "Tired",
      note: "Begadang sampai jam 3 pagi nge-fix bug Prisma.",
    },
    {
      daysAgo: 13,
      tagName: "Depressed",
      note: "Rasanya pengen nyerah aja. Capek banget fisik dan mental.",
    },
    {
      daysAgo: 12,
      tagName: "Hopeless",
      note: "Kode error terus, gak tau lagi harus nanya siapa.",
    },
    {
      daysAgo: 11,
      tagName: "Insecure",
      note: "Liat temen progresnya cepet banget, jadi ngerasa tertinggal.",
    },
    {
      daysAgo: 10,
      tagName: "Lonely",
      note: "Ngerjain semuanya sendirian di kamar. Butuh teman ngobrol.",
    },
    {
      daysAgo: 9,
      tagName: "Focused",
      note: "Memaksa diri buat fokus. Minum kopi 2 gelas hari ini.",
    },

    // --- MINGGU 4: Recovery & Penyelesaian ---
    {
      daysAgo: 8,
      tagName: "Tired",
      note: "Akhirnya selesai juga MVP-nya, tinggal presentasi besok.",
    },
    {
      daysAgo: 7,
      tagName: "Anxious",
      note: "Besok jadwal presentasi. Gugup banget sampai susah tidur.",
    },
    {
      daysAgo: 6,
      tagName: "Relieved",
      note: "PRESENTASI SELESAI! Dosen bilang konsepnya bagus. Plong banget rasanya.",
    },
    {
      daysAgo: 5,
      tagName: "Sleepy",
      note: "Tidur seharian membalas dendam jam tidur minggu lalu.",
    },
    {
      daysAgo: 4,
      tagName: "Grateful",
      note: "Bersyukur banget punya temen-temen yang support selama masa stres kemarin.",
    },
    {
      daysAgo: 3,
      tagName: "Happy",
      note: "Main game dari pagi sampai sore tanpa beban pikiran.",
    },
    {
      daysAgo: 2,
      tagName: "Excited",
      note: "Nyiapin rencana liburan kecil-kecilan minggu depan.",
    },
    {
      daysAgo: 1,
      tagName: "Proud",
      note: "Ngeliat hasil kodingan yang udah di-deploy, bangga banget bisa sejauh ini.",
    },

    // --- HARI INI ---
    {
      daysAgo: 0,
      tagName: "Satisfied",
      note: "Hari yang luar biasa! Semua berjalan lancar, siap untuk tantangan berikutnya.",
    },
  ];

  let successCount = 0;

  for (const log of logScenarios) {
    // 1. Cari Tag beserta MoodType-nya
    const tag = await prisma.feelingTag.findFirst({
      where: { tagName: log.tagName },
      include: { moodType: true },
    });

    if (tag) {
      // 2. Buat log dan isi tabel perantaranya
      await prisma.moodLog.create({
        data: {
          userId: targetUserId,
          moodTypeId: tag.moodType.id,
          logDate: getPastDate(log.daysAgo),
          journalNote: log.note,
          moodLogTags: {
            create: {
              feelingTagId: tag.id,
            },
          },
        },
      });
      successCount++;
    } else {
      console.log(
        `❌ Tag "${log.tagName}" tidak ditemukan! Cek ejaan master datamu.`,
      );
    }
  }

  console.log(
    `✅ Berhasil membuat ${successCount} Mood Logs (30 Hari) untuk user.`,
  );
}

// ==========================================
// GANTI ID INI DENGAN UUID USER DI DATABASEMU
// ==========================================
const USER_ID_TARGET = "204cbcbc-03ca-4c84-bfca-db3fe35a25d7";

moodSeed(USER_ID_TARGET)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
