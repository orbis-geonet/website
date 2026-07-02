interface TGROUPNAVLINK {
  title: string;
  href: string;
}

export type TGROUPNAVLINKS = TGROUPNAVLINK[];

export interface TUSER {
  slug: string;
  id: string;
  image: string;
  name: string;
  providerImageUrl?: string | null;
}

export type TUSERS = TUSER[];
