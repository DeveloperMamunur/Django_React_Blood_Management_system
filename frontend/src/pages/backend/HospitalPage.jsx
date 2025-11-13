import { useEffect, useState } from "react";
import { Badge, Button } from "../../components/ui";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { hospitalService } from "../../services/hospitalService";
import HospitalModal from "../../components/modals/HospitalModal";

export default function HospitalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await hospitalService.getAllHospitals();
        setHospitals(res.results || res || []);
      } catch (error) {
        console.error("Error loading Hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting Hospital ID:", id);
      // Add delete API call here later
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      const hospital = hospitals.find(h => h.id === id);
      if (!hospital) return;
      const newStatus = !hospital.is_verified;
      await hospitalService.verifyHospital(id, { is_verified: newStatus });

      setHospitals(prevHospitals =>
        prevHospitals.map(h =>
          h.id === id ? { ...h, is_verified: newStatus } : h
        )
      );

    } catch (error) {
      console.error("Error verifying hospital:", error);
    }
  };

  const handleView = (id) => {
    setSelectedHospitalId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedHospitalId(null);
  }

  return (
    <div className="p-6">
      <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
        Hospitals List
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading donors...
          </p>
        ) : hospitals?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No donors found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Username</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Email</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Phone</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Address</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{hospital?.user.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{hospital?.user.email || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{hospital?.user.phone_number || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {hospital?.location
                      ? `${hospital.location?.address_line1 || ""}, ${hospital.location?.police_station || ""}, ${hospital.location?.city || ""}, ${hospital.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {hospital?.is_verified === true ? (
                      <Badge status="success" label="Verified" icon={<CheckCircle size={14} />} />
                    ) : (
                      <Badge status="danger" label="Not Verified" icon={<XCircle size={14} />} />
                    )}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => {handleView(hospital.id)}}><Eye className="h-5 w-5" /> View</Button>
                    <Button variant={hospital?.is_verified ? "danger" : "success"} size="xs" onClick={() => handleToggleVerify(hospital.id)}>
                      {hospital?.is_verified ? (
                        <>
                          <XCircle className="h-5 w-5" /> Unverified
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" /> Verified
                        </>
                      )}
                    </Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(hospital.id)}>Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <HospitalModal isOpen={modalOpen} onClose={closeModal} hospitalId={selectedHospitalId} />
    </div>
  );
}
