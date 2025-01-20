'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        const response = await fetch(`/api/getCheckoutSession?sessionId=${sessionId}`);
        if (response.ok) {
          const sessionData = await response.json();
          setSessionDetails(sessionData);
        }
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="mt-4 text-lg">Thank you for your purchase.</p>

      {sessionDetails && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h2 className="font-semibold text-xl">Order Details:</h2>
          <p>Subscription ID: {sessionDetails.subscription}</p>
          <p>Email: {sessionDetails.customer_email}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
