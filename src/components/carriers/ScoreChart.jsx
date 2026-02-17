import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ScoreChart({ scoreHistory }) {
  const data = scoreHistory.slice().reverse().map(entry => ({
    month: entry.month.slice(5),
    score: entry.score,
    loads: entry.loads
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            domain={[80, 100]}
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1E3A5F',
              borderRadius: '8px',
              padding: '12px'
            }}
            labelStyle={{ color: '#F1F5F9' }}
            itemStyle={{ color: '#3B82F6' }}
            formatter={(value, name) => [
              name === 'score' ? `${value}%` : value,
              name === 'score' ? 'Score' : 'Loads'
            ]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
