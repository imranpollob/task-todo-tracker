import * as Icon from "lucide-react";
import { numberToTime } from "@/helpers/NumberToTime";

export function Task({
  name,
  time,
  addTime,
}: {
  name: string;
  time: number;
  addTime: () => void;
}) {
  return (
    <div className="flex flex-col items-start p-3 border border-gray-200 shadow-md">
      <div className="flex justify-between w-full items-center">
        <div className="font-medium">{name}</div>
        <div className="text-gray-500">{numberToTime(time)}</div>
      </div>
      <div className="flex items-center space-x-6 mt-2">
        <button onClick={() => addTime()}>
          <Icon.AlarmClockPlus className="w-5 h-5 text-gray-500" />
        </button>
        <button>
          <Icon.Pencil className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
