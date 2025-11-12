"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, ShoppingCart, ExternalLink, Calendar } from "lucide-react"

// Mock data
const revenueData = [
  { date: "Jan 1", revenue: 450 },
  { date: "Jan 5", revenue: 680 },
  { date: "Jan 10", revenue: 920 },
  { date: "Jan 15", revenue: 1150 },
  { date: "Jan 20", revenue: 1340 },
  { date: "Jan 25", revenue: 1580 },
  { date: "Jan 30", revenue: 2347 },
]

const platformData = [
  { platform: "Etsy", revenue: 8450, change: "+12.5%", color: "orange", progress: 68 },
  { platform: "Amazon", revenue: 5320, change: "+8.3%", color: "amber", progress: 43 },
  { platform: "Shopify", revenue: 1430, change: "+23.1%", color: "green", progress: 15 },
]

const topDesigns = [
  {
    id: 1,
    name: "Vintage Coffee Logo",
    thumbnail: "/placeholder.svg?height=60&width=60",
    sales: 234,
    views: 1520,
    revenue: 3420,
  },
  {
    id: 2,
    name: "Minimalist Sunset",
    thumbnail: "/placeholder.svg?height=60&width=60",
    sales: 189,
    views: 1340,
    revenue: 2670,
  },
  {
    id: 3,
    name: "Retro Wave Pattern",
    thumbnail: "/placeholder.svg?height=60&width=60",
    sales: 156,
    views: 980,
    revenue: 2340,
  },
]

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("30 Days")
  const timeRanges = ["Today", "7 Days", "30 Days", "90 Days", "All Time"]

  return (
    <div className="p-6 space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-slate-400" />
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedRange === range
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
            <p className="text-sm text-slate-400 mt-1">Total earnings over time</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ${revenueData[revenueData.length - 1].revenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-400 mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+18.2% from last period</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Platform Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          {platformData.map((platform) => (
            <div
              key={platform.platform}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">{platform.platform}</div>
                  <div className="text-2xl font-bold text-white">${platform.revenue.toLocaleString()}</div>
                </div>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    platform.color === "orange"
                      ? "bg-orange-500/20 text-orange-400"
                      : platform.color === "amber"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {platform.change}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    platform.color === "orange"
                      ? "bg-gradient-to-r from-orange-500 to-orange-400"
                      : platform.color === "amber"
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  }`}
                  style={{ width: `${platform.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Designs */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Top Performing Designs</h3>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {topDesigns.map((design, index) => (
            <div
              key={design.id}
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Thumbnail */}
              <img
                src={design.thumbnail || "/placeholder.svg"}
                alt={design.name}
                className="w-14 h-14 rounded-lg object-cover border border-white/10"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="font-semibold text-white">{design.name}</div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {design.sales} sales
                  </span>
                  <span>{design.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">${design.revenue.toLocaleString()}</div>
              </div>

              {/* External link */}
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                <ExternalLink className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
