import * as Icon from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-t border-gray-200 ">
      <Button size="sm" variant="ghost" className="bg-slate-100">
        <Icon.ListIcon className="w-5 h-5" />
        <span className="sr-only">Track</span>
      </Button>
      <Button size="sm" variant="ghost">
        <Icon.SquareCheckBig className="w-5 h-5" />
        <span className="sr-only">Todo</span>
      </Button>
      <Button size="sm" variant="ghost">
        <Icon.PieChart className="w-5 h-5" />
        <span className="sr-only">Report</span>
      </Button>
    </nav>
  );
}
