export interface IStatus {
  color: string;
  text: string;
  icon: JSX.Element;
}

export interface IStatusComponentProps {
  dataFromAPI: {
    time: string;
    status: string;
  };
}

export interface IStatusData {
  time: string;
  status: IStatus | undefined;
}
