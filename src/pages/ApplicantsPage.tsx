import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Applicant {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  skills: string;
}

interface Application {
  _id: string;
  job: string;
  applicant: Applicant;
  status: string;
}

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/jobs/${id}/applicants`);
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${applicantId}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicantId
            ? { ...application, status: newStatus }
            : application
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading applicants...</p>;

  return (
    <div className="p-4 md:p-8 mx-auto max-w-6xl md:max-w-none md:mx-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Applicants</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-sm">No applicants yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded shadow p-4 flex flex-col gap-2"
            >
              <h2 className="text-lg font-semibold">{application.applicant.user.name}</h2>
              <p className="text-sm text-gray-600">{application.applicant.user.email}</p>
              <p className="text-sm text-gray-600">{application.applicant.user.phone}</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Skills:</span> {application.applicant.skills}
              </p>

              <div className="mt-2">
                <label className="text-sm font-medium block mb-1">Status:</label>
                <select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(application._id, e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full text-sm"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
