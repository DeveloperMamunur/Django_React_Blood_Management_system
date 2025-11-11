
import { useAuth } from "../../hooks/useAuth";
import AdminRequest from "./requests/AdminRequest";
import DonorRequest from "./requests/DonorRequest";
import HospitalRequest from "./requests/HospitalRequest";
import ReceiverRequest from "./requests/ReceiverRequest";


export default function RequestPage() {
  const { currentUser } = useAuth();
  switch (currentUser.role) {
    case "ADMIN":
      return <AdminRequest />;
    case "DONOR":
      return <DonorRequest />;
    case "RECEIVER":
      return <ReceiverRequest />;
    case "HOSPITAL":
      return <HospitalRequest />;
    default:
      return <div className="p-6 text-center">Unknown role</div>;
  }
 
}
