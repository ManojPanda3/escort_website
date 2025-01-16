'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, DollarSign, Users, CreditCard, Search, Trash2, Edit, CheckCircle } from 'lucide-react'
import { PricingPackages } from './pricing-packages'
import { UnverifiedUsers } from './unverified-users'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState('statistics')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.user_metadata.role !== 'admin') {
        // router.push('/admin/login')
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  // Placeholder data for the charts
  const userStats = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 500 },
    { name: 'Apr', users: 280 },
    { name: 'May', users: 200 },
    { name: 'Jun', users: 600 },
  ]

  const transactionStats = [
    { name: 'Jan', transactions: 65 },
    { name: 'Feb', transactions: 59 },
    { name: 'Mar', transactions: 80 },
    { name: 'Apr', transactions: 81 },
    { name: 'May', transactions: 56 },
    { name: 'Jun', transactions: 55 },
  ]

  // Updated placeholder data for pricing packages
  const pricingPackages = [
    {
      id: 1,
      name: 'Basic',
      amount: 9.99,
      billingCycle: 'monthly',
      features: [
        '1 City Promotion',
        'Basic Profile Features',
        'Standard Support',
      ],
    },
    {
      id: 2,
      name: 'Premium',
      amount: 19.99,
      billingCycle: 'monthly',
      features: [
        '5 City Promotion',
        'Advanced Profile Features',
        'Priority Support',
        'Featured Listing',
      ],
    },
    {
      id: 3,
      name: 'Pro',
      amount: 29.99,
      billingCycle: 'monthly',
      features: [
        'Nationwide Promotion',
        'Premium Profile Features',
        '24/7 Support',
        'Featured Listing',
        'Verified Badge',
      ],
    },
  ]

  // Placeholder data for unverified users
  const unverifiedUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', documents: ['/placeholder.svg', '/placeholder.svg'] },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', documents: ['/placeholder.svg', '/placeholder.svg'] },
    { id: 3, username: 'bob_johnson', email: 'bob@example.com', documents: ['/placeholder.svg', '/placeholder.svg'] },
  ]

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

  const [[page, direction], setPage] = useState([0, 0]);

  const tabIndex = { statistics: 0, packages: 1, users: 2 };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        <Tabs value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          paginate(tabIndex[newTab as keyof typeof tabIndex] - tabIndex[activeTab as keyof typeof tabIndex]);
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
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
              {activeTab === 'statistics' && (
                <TabsContent value="statistics">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2,345</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$12,345</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-8">
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
                            <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" />
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
                            <Line type="monotone" dataKey="transactions" stroke="hsl(var(--primary))" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
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
                              <TableCell className={transaction.status.toLowerCase() == 'completed' ? "text-green-600" : "text-red-600"}>{transaction.status}</TableCell>
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
                      <PricingPackages packages={pricingPackages} />
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
                      <UnverifiedUsers users={unverifiedUsers} />
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

