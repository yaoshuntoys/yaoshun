import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { statfs } from 'fs/promises';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';

type DashboardStatusColor = 'success' | 'processing' | 'warning' | 'default';
type ActivityType = 'create' | 'update' | 'delete';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getStats() {
    const [
      productCount,
      activeProductCount,
      newsCount,
      publishedNewsCount,
      faqCount,
      activeFaqCount,
      partnerCount,
      activePartnerCount,
      mediaCount,
      totalMessageCount,
      unreadMessageCount,
      totalMailCount,
      sentMailCount,
      todayLogCount,
      storageValue,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'active' } }),
      this.prisma.news.count(),
      this.prisma.news.count({ where: { status: 'published' } }),
      this.prisma.faqItem.count(),
      this.prisma.faqItem.count({ where: { status: 'active' } }),
      this.prisma.partner.count(),
      this.prisma.partner.count({ where: { status: 'active' } }),
      this.prisma.mediaAsset.count({ where: { deletedAt: null } }),
      this.prisma.customerMessage.count(),
      this.prisma.customerMessage.count({ where: { isRead: false } }),
      this.prisma.mailRecord.count(),
      this.prisma.mailRecord.count({ where: { status: 'sent' } }),
      this.prisma.operationLog.count({
        where: {
          createdAt: {
            gte: this.getStartOfToday(),
          },
        },
      }),
      this.getStorageValue(),
    ]);

    const totalContentCount =
      productCount + newsCount + faqCount + partnerCount;
    const publishedContentCount =
      activeProductCount +
      publishedNewsCount +
      activeFaqCount +
      activePartnerCount;

    return {
      stats: [
        {
          key: 'content',
          title: '内容总量',
          value: totalContentCount,
          trend: `产品 ${productCount} / 新闻 ${newsCount} / FAQ ${faqCount} / 合作客户 ${partnerCount}`,
        },
        {
          key: 'published',
          title: '线上展示',
          value: publishedContentCount,
          trend: `已上架或已发布内容 ${publishedContentCount} 项`,
        },
        {
          key: 'media',
          title: '媒体文件',
          value: mediaCount,
          trend: '内容管理资源库',
        },
        {
          key: 'message',
          title: '待处理留言',
          value: unreadMessageCount,
          trend: `总留言 ${totalMessageCount} 条`,
        },
      ],
      systemStatus: [
        {
          key: 'database',
          label: '数据库连接',
          value: '正常',
          color: 'success' as DashboardStatusColor,
        },
        {
          key: 'mail',
          label: '邮件发送记录',
          value:
            totalMailCount > 0
              ? `成功 ${sentMailCount}/${totalMailCount}`
              : '暂无记录',
          color: this.resolveMailColor(totalMailCount, sentMailCount),
        },
        {
          key: 'logs',
          label: '今日操作日志',
          value: `${todayLogCount} 条`,
          color: todayLogCount > 0 ? 'processing' : 'default',
        },
        {
          key: 'storage',
          label: '存储空间',
          value: storageValue,
          color: 'default' as DashboardStatusColor,
        },
      ],
    };
  }

  async getRecentActivities() {
    const items = await this.prisma.operationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return items.map((item) => ({
      id: item.id,
      user: item.username || '系统',
      action: item.action,
      module: item.module,
      target: item.details,
      createdAt: item.createdAt,
      type: this.resolveActivityType(item.action),
    }));
  }

  private resolveActivityType(action: string): ActivityType {
    if (/删|清空|移除/.test(action)) {
      return 'delete';
    }
    if (/创建|新增|上传|发送|提交/.test(action)) {
      return 'create';
    }
    return 'update';
  }

  private resolveMailColor(
    totalMailCount: number,
    sentMailCount: number,
  ): DashboardStatusColor {
    if (totalMailCount === 0) {
      return 'default';
    }
    if (sentMailCount === totalMailCount) {
      return 'success';
    }
    if (sentMailCount === 0) {
      return 'warning';
    }
    return 'processing';
  }

  private async getStorageValue() {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
    const uploadPath = join(process.cwd(), uploadDir);

    try {
      const stats = await statfs(uploadPath);
      const total = Number(stats.blocks) * Number(stats.bsize);
      const free = Number(stats.bavail) * Number(stats.bsize);
      const used = Math.max(total - free, 0);
      const percent = total > 0 ? Math.round((used / total) * 100) : 0;

      return `${percent}%`;
    } catch {
      const fileCount = await this.prisma.mediaAsset.count({ where: { deletedAt: null } });
      return `${fileCount} 个文件`;
    }
  }

  private getStartOfToday() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }
}
