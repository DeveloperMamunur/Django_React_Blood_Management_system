import { CheckCircle, Clock, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

export function EligibilityBadge({ days }) {
  let colorClass = "bg-gray-400";
  let Icon = HelpCircle;
  let label = "Unknown";

  if (days === 0) {
    colorClass = "bg-green-500";
    Icon = CheckCircle;
    label = "Eligible Now";
  } else if (days > 0 && days <= 10) {
    colorClass = "bg-orange-500";
    Icon = AlertTriangle;
    label = `Eligible in ${days} days`;
  } else if (days > 10) {
    colorClass = "bg-red-500";
    Icon = XCircle;
    label = `Eligible in ${days} days`;
  }

  return (
    <span className={`${colorClass} text-white py-1.5 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
