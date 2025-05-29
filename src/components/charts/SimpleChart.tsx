"use client"

interface ChartData {
  label: string
  value: number
  color: string
}

interface SimpleChartProps {
  data: ChartData[]
  title: string
}

export default function SimpleChart({ data, title }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1) // Ensure at least 1 to avoid division by zero

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-24 text-sm font-medium text-gray-700 flex-shrink-0">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${Math.max((item.value / maxValue) * 100, 5)}%`, // Minimum 5% width for visibility
                  backgroundColor: item.color,
                }}
              >
                {item.value > 0 && <span className="text-white text-xs font-semibold">{item.value}</span>}
              </div>
            </div>
            <div className="w-12 text-sm font-bold text-gray-900 text-right">{item.value}</div>
          </div>
        ))}
      </div>
      {data.every((item) => item.value === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">No data available yet</p>
        </div>
      )}
    </div>
  )
}
