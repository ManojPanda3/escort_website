"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip as RadixTooltip } from "@radix-ui/react-tooltip";
import { CreditCard, DollarSign, LineChart, Users } from "lucide-react";
import { CartesianGrid, Legend, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const GrowthChart = () => {
  const userStats = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 500 },
    { name: 'Apr', users: 280 },
    { name: 'May', users: 200 },
    { name: 'Jun', users: 600 },
  ]
  return (
    <LineChart data={userStats}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="users" stroke="#fbbf24" dot={false} />
    </LineChart>
  );
}
export const TransactionChart = () => {
  const transactionStats = [
    { name: 'Jan', transactions: 65 },
    { name: 'Feb', transactions: 59 },
    { name: 'Mar', transactions: 80 },
    { name: 'Apr', transactions: 81 },
    { name: 'May', transactions: 56 },
    { name: 'Jun', transactions: 55 },
  ]
  return (
    <LineChart data={transactionStats}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="transactions" stroke="#fbbf24" />
    </LineChart>
  );
}
