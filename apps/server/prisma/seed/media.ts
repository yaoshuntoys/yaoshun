import type { SeedPrisma } from './client';

const folders = ['图片', '视频', '产品素材', '新闻素材', '证书文件'];

export async function seedMedia(prisma: SeedPrisma) {
  for (const name of folders) {
    const existing = await prisma.mediaFolder.findFirst({
      where: { name, parentId: null },
    });

    if (!existing) {
      await prisma.mediaFolder.create({
        data: { name, parentId: null, isSystem: true },
      });
    }
  }
}
