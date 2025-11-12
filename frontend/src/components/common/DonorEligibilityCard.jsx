import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const DonorEligibilityCard = ({ days }) => {
  let bgColor = "bg-red-500 dark:bg-red-600 hover:bg-red-600";
  let Icon = XCircle;
  let title = "Not Available";
  let pulse = "";

  if (days === 0) {
    bgColor = "bg-green-600 dark:bg-green-700 hover:bg-green-700";
    Icon = CheckCircle;
    title = "Available";
    pulse = "animate-pulse";
  } else if (days <= 10) {
    bgColor = "bg-orange-500 dark:bg-orange-600 hover:bg-orange-600";
    Icon = AlertTriangle;
    title = "Almost Eligible";
  }

  return (
    <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg ${pulse}`}>
      <div className="flex items-center gap-2">
        <Icon size={24} />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-lg font-semibold">({days} days)</p>
      </div>
      <div className="mt-2">
        <p className="text-sm font-bold">For Blood Donation</p>
      </div>
    </div>
  );
};
