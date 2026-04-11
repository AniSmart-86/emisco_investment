import OrderConfirmationPage from "../../components/order-confirm";
import { verifyPaystackPayment } from "@/lib/payments";

export const dynamic = "force-dynamic";

export default async function ConfirmPayment({
  searchParams,
}: {
  searchParams: Promise<{
    reference?: string;
    trxref?: string;
    orderId?: string;
  }>;
}) {
  // ✅ Await searchParams as required in Next.js 15/16
  const { reference, trxref, orderId } = await searchParams;

  // Paystack sometimes returns trxref instead of reference
  const paymentReference = reference || trxref;

  if (!paymentReference || !orderId) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Payment Request</h1>
        <p className="text-muted-foreground">Missing payment reference or order ID.</p>
      </div>
    );
  }

  let result;
  try {
    // ✅ Call logic directly on the server.
    result = await verifyPaystackPayment(paymentReference, orderId);
  } catch (error) {
    console.error("Order confirmation error:", error);
    // Even if it throws, we should handle it gracefully
    result = { success: false, message: "An unexpected error occurred." };
  }

  if (!result || !result.success) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Verification Failed
        </h1>
        <p className="text-muted-foreground">{result?.message || "Payment could not be verified."}</p>
      </div>
    );
  }

  // ✅ Defensive Data Access
  // Prioritize verified database data over API response for reliability
  const displayAmount = result.order?.amount ?? (result.data?.amount ? result.data.amount / 100 : 0);
  const displayEmail = result.order?.email ?? result.data?.customer?.email ?? "Customer";

  return (
    <OrderConfirmationPage
      reference={paymentReference}
      orderId={orderId}
      amount={displayAmount}
      email={displayEmail}
    />
  );
}