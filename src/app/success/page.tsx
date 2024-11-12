'use client'

import React, { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from 'lucide-react';

function SuccessPageContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-green-100">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">
            Purchase Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center">
            Thank you for your purchase! You will receive an email with your license key shortly.
          </p>

          <div className="pt-4 text-center">
            <Button asChild className="bg-[#765de7] hover:bg-[#765de7]/90">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
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
