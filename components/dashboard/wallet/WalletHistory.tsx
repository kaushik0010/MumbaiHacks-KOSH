"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { walletTopUpColumns, WalletTopUp } from "./columns";
import { Loader2, ArrowLeft, ArrowRight, History } from "lucide-react";

interface WalletHistoryProps {
  initialTopups: WalletTopUp[];
  initialTotalPages: number;
}

export default function WalletHistory({ initialTopups, initialTotalPages }: WalletHistoryProps) {
  const [topups, setTopups] = useState<WalletTopUp[]>(initialTopups);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  
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
    <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg">
          <DataTable columns={walletTopUpColumns} data={topups} />
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {topups.length} transactions
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="gap-1 border-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm font-medium text-gray-700 min-w-20 text-center">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="gap-1 border-2 cursor-pointer"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}