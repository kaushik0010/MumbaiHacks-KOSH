"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { walletTopUpColumns, WalletTopUp } from "./columns";
import { Loader2 } from "lucide-react";

interface WalletHistoryProps {
  initialTopups: WalletTopUp[];
  initialTotalPages: number;
}

export default function WalletHistory({ initialTopups, initialTotalPages }: WalletHistoryProps) {
  const [topups, setTopups] = useState<WalletTopUp[]>(initialTopups);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTopups(initialTopups);
    setTotalPages(initialTotalPages);
    setCurrentPage(1);
  }, [initialTopups, initialTotalPages]);
  
  // Prevent initial fetch since we have server data
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const fetchTopups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/wallet/topups?page=${currentPage}&limit=5`);
        if (response.data.success) {
          setTopups(response.data.data.topups);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch wallet history");
      } finally {
        setLoading(false);
      }
    };

    fetchTopups();
  }, [currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <DataTable columns={walletTopUpColumns} data={topups} />
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
             Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}