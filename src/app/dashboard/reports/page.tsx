"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type {
  StockReportDTO,
  ProductReportDTO,
  InventoryReportDTO,
} from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Register the plugin
// (This is enough for modern jsPDF + jspdf-autotable)

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  for (const row of data) {
    const values = headers.map((header) => JSON.stringify(row[header] ?? ""));
    csvRows.push(values.join(","));
  }
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function downloadExcel(data: any[], filename: string) {
  if (!data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
}

function printReport() {
  window.print();
}

export default function ReportsPage() {
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [stockReport, setStockReport] = useState<StockReportDTO | null>(null);
  const [productReport, setProductReport] = useState<ProductReportDTO[]>([]);
  const [inventoryReport, setInventoryReport] = useState<InventoryReportDTO[]>(
    []
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    // Initial state: no report fetched automatically
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setReportGenerated(false);
    setStockReport(null);
    setProductReport([]);
    setInventoryReport([]);
    try {
      // Convert dates to ISO 8601 with time if both are provided
      const formattedStartDate = startDate ? `${startDate}T00:00:00` : "";
      const formattedEndDate = endDate ? `${endDate}T23:59:59` : "";
      const [stockData, productData, inventoryData] = await Promise.all([
        startDate && endDate
          ? apiClient.getStockReportByDateRange(
              formattedStartDate,
              formattedEndDate
            )
          : apiClient.getStockReport(),
        startDate && endDate
          ? apiClient.getProductReportByDateRange(
              formattedStartDate,
              formattedEndDate
            )
          : apiClient.getProductReport(),
        startDate && endDate
          ? apiClient.getInventoryReportByDateRange(
              formattedStartDate,
              formattedEndDate
            )
          : apiClient.getInventoryReport(),
      ]);
      setStockReport(stockData);
      setProductReport(productData);
      setInventoryReport(inventoryData);
      setReportGenerated(true);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      showToast("Failed to load reports", "error");
      setReportGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!stockReport || !reportGenerated) return;

    setDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yOffset = 20;

      // Title
      doc.setFontSize(20);
      doc.text("Inventory Management System Report", pageWidth / 2, yOffset, {
        align: "center",
      });
      yOffset += 20;

      // Date Range
      doc.setFontSize(12);
      const dateRange =
        startDate && endDate
          ? `Report Period: ${new Date(
              startDate
            ).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
          : "Report Period: All Time";
      doc.text(dateRange, pageWidth / 2, yOffset, { align: "center" });
      yOffset += 20;

      // Stock Overview
      doc.setFontSize(16);
      doc.text("Stock Overview", margin, yOffset);
      yOffset += 10;

      const overviewData = [
        ["Total Products", stockReport.totalProducts.toString()],
        ["Total Low Stock Items", stockReport.totalLowStockItems.toString()],
      ];

      (doc as any).autoTable({
        startY: yOffset,
        head: [["Metric", "Value"]],
        body: overviewData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 20;

      // Low Stock Products
      if (stockReport.lowStockProducts.length > 0) {
        doc.setFontSize(16);
        doc.text("Low Stock Products", margin, yOffset);
        yOffset += 10;

        const lowStockData = stockReport.lowStockProducts.map((product) => [
          product.name,
          product.currentQuantity.toString(),
          product.minimumStockLevel.toString(),
          product.inventoryName,
          product.location,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [
            [
              "Product",
              "Current Stock",
              "Minimum Level",
              "Inventory",
              "Location",
            ],
          ],
          body: lowStockData,
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });

        yOffset = (doc as any).lastAutoTable.finalY + 20;
      }

      // Product Distribution
      if (productReport.length > 0) {
        doc.setFontSize(16);
        doc.text("Product Distribution", margin, yOffset);
        yOffset += 10;

        const productData = productReport.map((product) => [
          product.name,
          product.quantity.toString(),
          `$${product.price.toFixed(2)}`,
          product.minimumStockLevel.toString(),
          product.inventoryName,
          product.location,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [
            [
              "Product",
              "Quantity",
              "Price",
              "Minimum Level",
              "Inventory",
              "Location",
            ],
          ],
          body: productData,
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });

        yOffset = (doc as any).lastAutoTable.finalY + 20;
      }

      // Inventory Distribution
      if (inventoryReport.length > 0) {
        doc.setFontSize(16);
        doc.text("Inventory Distribution", margin, yOffset);
        yOffset += 10;

        const inventoryData = inventoryReport.map((inventory) => [
          inventory.name,
          inventory.location,
          inventory.totalProducts.toString(),
          `$${inventory.totalNetPrice.toFixed(2)}`,
          inventory.userEmail,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [
            ["Inventory", "Location", "Total Products", "Total Value", "Owner"],
          ],
          body: inventoryData,
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });
      }

      // Save the PDF
      const fileName = `inventory-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
      showToast("Report downloaded successfully!", "success");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      showToast("Failed to generate PDF report", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
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

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Reports
            </h1>
            <p className="text-gray-600 mt-1">
              View inventory and product analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-3">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                label="Start Date"
                className="min-w-[160px]"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                label="End Date"
                className="min-w-[160px]"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchReports}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
              <Button
                onClick={generatePDF}
                disabled={loading || downloading || !reportGenerated}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            onClick={() => downloadCSV(productReport, "product-report.csv")}
            className="bg-blue-500 text-white"
          >
            Download CSV
          </Button>
          <Button
            onClick={() => downloadExcel(productReport, "product-report.xlsx")}
            className="bg-green-600 text-white"
          >
            Download Excel
          </Button>
          <Button onClick={printReport} className="bg-gray-600 text-white">
            Print / Save as PDF
          </Button>
        </div>

        {reportGenerated && stockReport && (
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Stock Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">
                    Total Products
                  </h3>
                  <p className="text-3xl font-bold text-blue-700">
                    {stockReport.totalProducts}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium text-yellow-600 mb-2">
                    Low Stock Items
                  </h3>
                  <p className="text-3xl font-bold text-yellow-700">
                    {stockReport.totalLowStockItems}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {stockReport.lowStockProducts.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Low Stock Products
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Current Stock
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Minimum Level
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Inventory
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stockReport.lowStockProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.currentQuantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.minimumStockLevel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.inventoryName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.location}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productReport.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Product Distribution
                    </h3>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={productReport}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#E5E7EB"
                            />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E5E7EB",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="quantity"
                              name="Quantity"
                              fill="#3B82F6"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="price"
                              name="Price ($)"
                              fill="#10B981"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {inventoryReport.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Inventory Distribution
                    </h3>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={inventoryReport}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#E5E7EB"
                            />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E5E7EB",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="totalProducts"
                              name="Products"
                              fill="#6366F1"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="totalNetPrice"
                              name="Value ($)"
                              fill="#F59E0B"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {!loading && !reportGenerated && (
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Generate a Report
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Select a date range and click "Generate Report" to view detailed
                analytics and insights about your inventory.
              </p>
              <div className="flex justify-center gap-3">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  label="Start Date"
                  className="min-w-[160px]"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  label="End Date"
                  className="min-w-[160px]"
                />
                <Button
                  onClick={fetchReports}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
