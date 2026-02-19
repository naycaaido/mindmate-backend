import prisma from "../database/prisma.js";

const MODULE_DATA = {
  1: {
    // Very Sad (Sesuaikan ID ini dengan ID di tabel MoodType)
    title: "Ruang Pemulihan",
    description: "Panduan kecil untuk membantumu bernapas lega.",
    modalContent: {
      intro: "Tidak apa-apa merasa hancur saat ini. Kamu aman di sini.",
      steps: [
        "Cari posisi duduk atau berbaring yang paling nyaman.",
        "Tutup matamu perlahan, letakkan tangan di dada.",
        "Tarik napas dalam selama 4 detik... tahan 4 detik... hembuskan 6 detik.",
        "Ulangi dan katakan: 'Aku mengizinkan diriku untuk merasa sakit, dan aku akan pulih.'",
        "Minumlah segelas air hangat setelah ini.",
      ],
    },
  },
  2: {
    // Sad
    title: "Memeluk Emosi",
    description: "Mari urai perasaan ini perlahan.",
    modalContent: {
      intro: "Perasaan ini valid. Jangan dilawan, mari kita sadari.",
      steps: [
        "Ambil kertas atau buka aplikasi catatan di HP-mu.",
        "Tuliskan satu kata yang mewakili perasaanmu saat ini.",
        "Tanya dirimu: 'Kenapa perasaan ini datang?' Jawab jujur.",
        "Ingatlah bahwa emosi itu seperti cuaca, ia akan berganti.",
        "Berikan pelukan kupu-kupu (silangkan tangan di dada dan tepuk pelan bahumu).",
      ],
    },
  },
  3: {
    // Normal
    title: "Mindfulness Dasar",
    description: "Latihan fokus singkat untuk harimu.",
    modalContent: {
      intro: "Jaga momentum ketenanganmu dengan latihan fokus 2 menit.",
      steps: [
        "Jauhkan HP dari jangkauan tangan selama 2 menit.",
        "Fokuskan pandangan pada satu benda di sekitarmu.",
        "Perhatikan warnanya, teksturnya, dan bayangannya.",
        "Jika pikiranmu melayang, tarik napas dan kembali fokus ke benda itu.",
        "Tersenyumlah sedikit, dan lanjutkan aktivitasmu.",
      ],
    },
  },
  4: {
    // Happy
    title: "Jurnal Rasa Syukur",
    description: "Catat hal baik agar bahagia bertahan lama.",
    modalContent: {
      intro: "Kebahagiaan itu menular! Mari kita simpan energinya.",
      steps: [
        "Pikirkan 3 hal kecil yang membuatmu tersenyum hari ini.",
        "Bisa jadi kopi yang enak, pesan dari teman, atau cuaca cerah.",
        "Tuliskan 3 hal tersebut dan rasakan kembali momennya.",
        "Bagikan energi positif ini ke satu orang temanmu.",
        "Katakan: 'Terima kasih untuk hari ini.'",
      ],
    },
  },
  5: {
    // Very Happy
    title: "Abadikan Momen",
    description: "Salurkan energimu untuk masa depan.",
    modalContent: {
      intro:
        "Kamu sedang bersinar! Gunakan cahaya ini untuk dirimu di masa depan.",
      steps: [
        "Ambil selfie atau foto keadaan sekitarmu sekarang.",
        "Tulis pesan untuk dirimu saat sedang sedih nanti.",
        "Contoh: 'Hei, ingat hari ini? Kamu pernah sangat bahagia, dan kamu akan bahagia lagi.'",
        "Putar lagu favoritmu dan nikmati momen ini sepenuhnya.",
        "Lakukan satu kebaikan random untuk orang asing.",
      ],
    },
  },
};

async function main() {
  console.log("Memulai proses seed Relaxation Content...");

  // Opsi: Hapus data lama agar tidak terjadi duplikasi saat seed dijalankan ulang
  await prisma.relaxationContent.deleteMany({});
  console.log("Data lama dihapus (jika ada).");

  for (const [moodId, data] of Object.entries(MODULE_DATA)) {
    await prisma.relaxationContent.create({
      data: {
        moodTypeId: parseInt(moodId), // Pastikan ID ini cocok dengan yang ada di tabel MoodType
        title: data.title,
        description: data.description,
        modalIntro: data.modalContent.intro,
        modalSteps: data.modalContent.steps, // Prisma otomatis parse Array ke JSON
      },
    });
    console.log(`Berhasil insert konten untuk moodTypeId: ${moodId}`);
  }

  console.log("Proses seed selesai.");
}

main()
  .catch((e) => {
    console.error("Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
