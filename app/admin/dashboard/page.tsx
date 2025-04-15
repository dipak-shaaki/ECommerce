import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Download Report</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      +20.1% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      +12.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,324</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      +8.4% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2,350</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 flex items-center">
                      -4.5% <ArrowDownRight className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-7652</TableCell>
                        <TableCell>John Smith</TableCell>
                        <TableCell>2023-06-24</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Delivered</Badge>
                        </TableCell>
                        <TableCell>$125.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-7651</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>2023-06-23</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500">Processing</Badge>
                        </TableCell>
                        <TableCell>$86.47</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-7650</TableCell>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>2023-06-23</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Pending</Badge>
                        </TableCell>
                        <TableCell>$42.25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-7649</TableCell>
                        <TableCell>Emily Davis</TableCell>
                        <TableCell>2023-06-22</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Delivered</Badge>
                        </TableCell>
                        <TableCell>$92.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-7648</TableCell>
                        <TableCell>Robert Wilson</TableCell>
                        <TableCell>2023-06-22</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">Cancelled</Badge>
                        </TableCell>
                        <TableCell>$52.99</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Products that need restocking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-100 p-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Paracetamol 500mg</p>
                        <p className="text-xs text-muted-foreground">Only 5 units left</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-100 p-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Amoxicillin 250mg</p>
                        <p className="text-xs text-muted-foreground">Only 8 units left</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-yellow-100 p-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Vitamin C 1000mg</p>
                        <p className="text-xs text-muted-foreground">Only 15 units left</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-yellow-100 p-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Digital Thermometer</p>
                        <p className="text-xs text-muted-foreground">Only 12 units left</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
