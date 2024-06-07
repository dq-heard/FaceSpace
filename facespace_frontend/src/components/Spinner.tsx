import { FC, ReactNode } from "react";
import { CircleLoader } from "react-spinners";

interface SpinnerProps {
  message: string;
}

const Spinner: FC<SpinnerProps> = ({ message }): ReactNode => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <CircleLoader color="#00BFFF" size={50} className="m-5" />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
