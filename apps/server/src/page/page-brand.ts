export interface BrandInfo {
  nameZh: string;
  nameEn: string;
  legalNameZh: string;
  legalNameEn: string;
  logo: string;
  email: string;
  phone: string;
  website: string;
  addressZh: string;
  addressEn: string;
}

export function buildDefaultBrand(): BrandInfo {
  return {
    nameZh: '尧顺玩具',
    nameEn: 'Yaoshun Toys',
    legalNameZh: '东莞市尧顺科技有限公司',
    legalNameEn: 'Dongguan Yaoshun Technology Co., Ltd.',
    logo: '/favicon-rounded-192.png',
    email: 'yaoshuntoys@gmail.com',
    phone: '+86 18780083256',
    website: 'https://www.yaoshuntoys.com',
    addressZh: '中国广东省东莞市茶山镇伟兴路3号',
    addressEn: 'No. 3 Weixing Road, Chashan Town, Dongguan, Guangdong, China',
  };
}
