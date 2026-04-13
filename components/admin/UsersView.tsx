'use client';

import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UsersViewProps {
  users: User[];
  onDeleteUser: (id: string) => void;
}

export default function UsersView({ users, onDeleteUser }: UsersViewProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grow min-w-0">
      <Card className="border-border/50 bg-card rounded-[2.5rem] p-2 md:p-8 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pure-green/20">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent whitespace-nowrap">
                <TableHead className="font-bold">User Information</TableHead>
                <TableHead className="font-bold">Contact Email</TableHead>
                <TableHead className="font-bold">Residential Address</TableHead>
                <TableHead className="font-bold">Assigned Role</TableHead>
                <TableHead className="font-bold text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users?.map(u => (
                <TableRow key={u.id} className="border-border hover:bg-muted/30 whitespace-nowrap">
                  <TableCell className="font-bold py-6 px-4">{u.name}</TableCell>
                  <TableCell className="text-sm italic text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{u.address || 'No address saved'}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-pure-green/10 text-pure-green border border-pure-green/20' : 'bg-muted text-muted-foreground'}`}>
                      {u.role}
                    </span>
                  </TableCell>

                  <TableCell className="text-right px-6">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 rounded-lg font-bold text-[10px] uppercase"
                      onClick={() => onDeleteUser(u.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
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
