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
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className="h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
