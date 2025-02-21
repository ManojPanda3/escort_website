"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, CreditCard, MapPin, Plus } from 'lucide-react'
import { PricingPackages } from './pricing-packages'
import { UnverifiedUsers } from './unverified-users'
import { LocationManagement } from './location-management'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"


export default function AdminPages({ userStats, transactionStats, totalUsers, totalTransactions, totalEarnings, ageProof, offers, locations }) {

  const [activeTab, setActiveTab] = useState('transactions')
  const [[page, direction], setPage] = useState([0, 0]);


  // Placeholder data for recent transactions
  const recentTransactions = [
    { id: 1, user: 'john_doe', amount: 19.99, date: '2023-06-01', status: 'Completed' },
    { id: 2, user: 'jane_smith', amount: 29.99, date: '2023-06-02', status: 'Pending' },
    { id: 3, user: 'bob_johnson', amount: 9.99, date: '2023-06-03', status: 'Completed' },
    { id: 4, user: 'alice_williams', amount: 19.99, date: '2023-06-04', status: 'Completed' },
    { id: 5, user: 'charlie_brown', amount: 29.99, date: '2023-06-05', status: 'Failed' },
  ]

  const tabVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const tabIndex = { transactions: 0, packages: 1, users: 2 };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };



  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent animate-pulse">
          Admin Dashboard
        </h1>
        <div className="my-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="hover:bg-gray-900 cursor-pointer" title="Total Users">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <p className="text-gray-300 text-[0.75rem]">In 1 Year</p>
                </div>
                <Users className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card className="hover:bg-gray-900 cursor-pointer" title="Total Transactions">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <p className="text-gray-300 text-[0.75rem]">In 1 Year</p>
                </div>
                <CreditCard className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
              </CardContent>
            </Card>
            <Card className="hover:bg-gray-900 cursor-pointer" title="Total Earnings">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <p className="text-gray-300 text-[0.75rem]">In 1 Year</p>
                </div>
                <DollarSign className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarnings}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#fbbf24" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={transactionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="transactions" stroke="#fbbf24" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          paginate(tabIndex[newTab as keyof typeof tabIndex] - tabIndex[activeTab as keyof typeof tabIndex]);
        }}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="packages">Pricing Packages</TabsTrigger>
            <TabsTrigger value="users">Unverified Users</TabsTrigger>
          </TabsList>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {activeTab === 'transactions' && (
                <TabsContent value="transactions">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id} className='cursor-pointer'>
                              <TableCell>{transaction.user}</TableCell>
                              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell className={transaction.status.toLowerCase() === 'completed' ? "text-green-600" : "text-red-600"}>{transaction.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {activeTab === 'packages' && (
                <TabsContent value="packages">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing Packages</CardTitle>
                      <CardDescription>Manage and update pricing packages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PricingPackages offers={offers} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {activeTab === 'users' && (
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>Unverified Users Documentation</CardTitle>
                      <CardDescription>Review and verify user documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UnverifiedUsers users={ageProof} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>

      </div>
    </div>
  )
}
