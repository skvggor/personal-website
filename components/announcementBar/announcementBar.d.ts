export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  link: string;
  target?: string;
  bgColor?: string;
  textColor?: string;
}

export interface AnnouncementBarProps {
  config: AnnouncementBarConfig;
}
