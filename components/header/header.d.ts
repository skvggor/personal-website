export interface IHeaderContent {
  title: string;
  currentPosition: (string | JSX.Element)[];
  statusFromAPI: {
    time: string;
    status: string;
  };
}

export interface IStatusIndicator {
  indicatorBg: string;
  animate: string;
}
