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
import "jspdf-autotable";

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
      const [stockData, productData, inventoryData] = await Promise.all([
        startDate && endDate
          ? apiClient.getStockReportByDateRange(startDate, endDate)
          : apiClient.getStockReport(),
        startDate && endDate
          ? apiClient.getProductReportByDateRange(startDate, endDate)
          : apiClient.getProductReport(),
        startDate && endDate
          ? apiClient.getInventoryReportByDateRange(startDate, endDate)
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
        ["Total Value", `$${stockReport.totalValue.toFixed(2)}`],
        ["Low Stock Items", stockReport.lowStockProducts.length.toString()],
        ["Out of Stock", stockReport.outOfStockProducts.length.toString()],
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
          product.quantity.toString(),
          `$${product.price.toFixed(2)}`,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [["Product", "Current Stock", "Price"]],
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
          product.productName,
          product.totalQuantity.toString(),
          `$${product.totalValue.toFixed(2)}`,
          `$${product.averagePrice.toFixed(2)}`,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [["Product", "Total Quantity", "Total Value", "Average Price"]],
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
          inventory.inventoryName,
          inventory.totalProducts.toString(),
          `$${inventory.totalValue.toFixed(2)}`,
          `$${inventory.averageProductValue.toFixed(2)}`,
        ]);

        (doc as any).autoTable({
          startY: yOffset,
          head: [
            [
              "Inventory",
              "Total Products",
              "Total Value",
              "Average Product Value",
            ],
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

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">
              View inventory and product reports
            </p>
          </div>
          <div className="flex space-x-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              label="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              label="End Date"
            />
            <Button onClick={fetchReports} disabled={loading}>
              {loading ? "Loading..." : "Generate Report"}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={loading || downloading || !reportGenerated}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Generating..." : "Download PDF"}</span>
            </Button>
          </div>
        </div>

        {reportGenerated && stockReport && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">
                  Total Products
                </h3>
                <p className="text-2xl font-bold text-blue-700">
                  {stockReport.totalProducts}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600">
                  Total Value
                </h3>
                <p className="text-2xl font-bold text-green-700">
                  ${stockReport.totalValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-600">
                  Low Stock Items
                </h3>
                <p className="text-2xl font-bold text-yellow-700">
                  {stockReport.lowStockProducts.length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-600">
                  Out of Stock
                </h3>
                <p className="text-2xl font-bold text-red-700">
                  {stockReport.outOfStockProducts.length}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {stockReport.lowStockProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Low Stock Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Current Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockReport.lowStockProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${product.price}
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
                  <h3 className="text-lg font-medium mb-4">
                    Product Distribution
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productReport}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="totalQuantity"
                          name="Quantity"
                          fill="#3B82F6"
                        />
                        <Bar
                          dataKey="totalValue"
                          name="Value ($)"
                          fill="#10B981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {inventoryReport.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Inventory Distribution
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryReport}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="inventoryName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="totalProducts"
                          name="Products"
                          fill="#6366F1"
                        />
                        <Bar
                          dataKey="totalValue"
                          name="Value ($)"
                          fill="#F59E0B"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {!loading && !reportGenerated && (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Generate a Report
              </h3>
              <p className="text-gray-500 mb-6">
                Select a date range and click "Generate Report" to view
                analytics.
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
