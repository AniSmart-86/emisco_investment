'use client';

import { Order } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeliveryStatus } from '@/lib/generated/prisma/enums';
import { motion } from 'framer-motion';

interface OrdersViewProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: DeliveryStatus) => void;
}

export default function OrdersView({ orders, onUpdateStatus }: OrdersViewProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grow">
            <Card className="border-border/50 bg-card rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8 gap-4">
                    <h3 className="text-lg md:text-2xl font-bold">Order Management</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider">{orders.length} Total</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="font-bold">Order Details</TableHead>
                                <TableHead className="font-bold">Customer</TableHead>
                                <TableHead className="font-bold">Payment</TableHead>
                                <TableHead className="font-bold">Amount</TableHead>
                                <TableHead className="font-bold text-right">Delivery Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o.id} className="border-border hover:bg-muted/30">
                                    <TableCell className="py-6">
                                        <div className="text-xs font-mono text-muted-foreground mb-1 uppercase">#{o.id.slice(0, 8)}</div>
                                        <div className="text-xs font-semibold">{new Date(o.createdAt).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-sm">{o.user?.name || 'Guest'}</div>
                                        <div className="text-[10px] text-muted-foreground italic">{o.user?.email || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${o.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                                                o.paymentStatus === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {o.paymentStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold">₦{o.totalAmount?.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <select
                                            className="bg-muted/50 border-none rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-pure-green/50 cursor-pointer outline-none transition-all"
                                            value={o.deliveryStatus}
                                            onChange={(e) =>
                                                onUpdateStatus(
                                                    o.id,
                                                    e.target.value as DeliveryStatus
                                                )
                                            }
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                            <option value="DELIVERED">Delivered</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </motion.div>
    );
}
