import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const target = await prisma.target.create({
    data: {
      name: 'OpenAI Safety Bug Bounty',
      baseUrl: 'https://bugcrowd.com/engagements/openai-safety',
      scope: `Celah yang dicari mencakup masalah desain atau implementasi yang bisa disalahgunakan, seperti:
- Agentic Tools: Seperti MCP (Model Context Protocol), Atlas Browser, Operator, dll. Fokus pada risiko di mana agen melakukan tindakan atas nama pengguna atau mengakses data pengguna.
- Informasi Properti OpenAI: Celah yang membocorkan data internal OpenAI (seperti Chain of Thought).
- Integritas Akun & Platform: Eksploitasi yang memungkinkan seseorang melewati batasan penggunaan secara massal atau memanipulasi integritas platform.
- Penyalahgunaan Baru (Novel Abuse): Masalah lain yang berpotensi membahayakan pengguna secara langsung.`,
      aiModelInfo: 'OpenAI Models, Agentic Tools (MCP, Atlas Browser, Operator)',
      notes: `Tujuan Program: Mengidentifikasi risiko keamanan dan penyalahgunaan (seperti eksploitasi pada agen AI) sebelum risiko tersebut berdampak pada pengguna nyata.
Out of Scope: Masalah Konten, Pihak Ketiga.
Aturan: Gunakan Akun Tes sendiri. Perlindungan Safe Harbor berlaku. Harus bisa direproduksi.
Bounty: $250 hingga $7.500 per temuan (max $100.000).
Status: Publik (Sejak Maret 2026), Expedited Triage.`,
      status: 'RESEARCHING'
    }
  });

  console.log('Target successfully created:', target);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
