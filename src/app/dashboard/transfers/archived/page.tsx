"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { TransferResponseDTO } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { ArrowLeft, Archive, Loader2 } from "lucide-react";

export default function ArchivedTransfersPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { addActivity } = useRecentActivity();
  const [transfers, setTransfers] = useState<TransferResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transfersData = await apiClient.getTransfers();
      // Filter to show only archived transfers
      setTransfers(transfersData.filter((transfer) => transfer.archived));
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to load archived transfers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (id: number) => {
    try {
      const updatedTransfer = await apiClient.unarchiveTransfer(id);
      if (updatedTransfer) {
        showToast("Transfer unarchived successfully!", "success");
        addActivity({
          type: "transfer_updated",
          title: "Transfer Unarchived",
          description: `Unarchived transfer of ${updatedTransfer.quantity} ${updatedTransfer.productName}`,
          icon: "📦",
          color: "blue",
        });
        fetchData();
      }
    } catch (error: any) {
      console.error("Failed to unarchive transfer:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to unarchive transfer";
      showToast(message, "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading archived transfers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Archived Transfers
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage archived inventory transfers
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/transfers")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Transfers</span>
          </Button>
        </div>

        {/* Transfers Table */}
        {transfers.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transfers.map((transfer) => (
                    <tr
                      key={transfer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transfer.sourceInventoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transfer.destinationInventoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transfer.status
                          )}`}
                        >
                          {transfer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleUnarchive(transfer.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Unarchive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Archive className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No archived transfers
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                There are no archived transfers at the moment
              </p>
              <Button
                onClick={() => router.push("/dashboard/transfers")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                Back to Transfers
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
