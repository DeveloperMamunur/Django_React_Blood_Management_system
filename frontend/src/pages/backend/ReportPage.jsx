import BloodRequestAnalytics from "./analytics/BloodRequestAnalytics";
import DonorReportPage from "./analytics/DonorReportPage";

export default function ReportPage() {
  return (
    <div>
      <DonorReportPage />
      <BloodRequestAnalytics />
    </div>
  );
}
