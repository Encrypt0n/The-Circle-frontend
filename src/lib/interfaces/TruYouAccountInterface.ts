export interface TruYouAccount {
  id: number;
  name: string;
  satoshi?: number;
  viewerCount?: number;
  isLive?: boolean;
  following: TruYouAccount[];
  followers: TruYouAccount[];
}