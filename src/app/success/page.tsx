'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Copy } from 'lucide-react';

interface OrderData {
  success: boolean;
  data?: {
    sessionId: string;
    customerEmail: string;
    productName: string;
    keyAuthLevel: string;
    licenseKey: string;
    paymentStatus: string;
  };
  error?: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetch(`/api/debug-webhook?session_id=${sessionId}`)
        .then(res => res.json())
        .then((data: OrderData) => {
          setOrderData(data);
          setStatus(data.success ? 'success' : 'error');
        })
        .catch(error => {
          console.error('Failed to fetch order details:', error);
          setStatus('error');
        });
    }
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('License key copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Check className={`w-8 h-8 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <CardTitle className={`text-2xl ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'loading' ? 'Processing Order...' : 
             status === 'success' ? 'Purchase Successful!' : 
             'Order Processing Error'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'loading' && (
            <p className="text-center">Please wait while we process your order...</p>
          )}

          {status === 'error' && (
            <div className="text-center text-red-600">
              <p>{orderData?.error || 'Failed to process order. Please contact support.'}</p>
            </div>
          )}

          {status === 'success' && orderData?.data && (
            <>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{orderData.data.productName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">License Key</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-3 py-1 rounded flex-1 font-mono text-sm break-all">
                      {orderData.data.licenseKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => orderData?.data?.licenseKey && copyToClipboard(orderData.data.licenseKey)}
                      >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center mt-4">
                  A confirmation email has been sent to {orderData.data.customerEmail}
                </p>
              </div>

              <div className="pt-4 text-center">
                <Button asChild className="bg-[#765de7] hover:bg-[#765de7]/90">
                  <Link href="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </>
          )}

          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(orderData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
