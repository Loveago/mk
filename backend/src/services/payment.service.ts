// Placeholder for integrating MTN Mobile Money, Card processors, and COD logic.
// Expose functions like initiateCheckout, verifyTransaction, refundTransaction.

export type CheckoutInput = {
  method: 'MOMO' | 'CARD' | 'COD';
  amount: number;
  currency?: string;
  metadata?: Record<string, unknown>;
};

export async function initiateCheckout(_input: CheckoutInput) {
  // Integrate with provider SDKs/APIs here
  return { status: 'PENDING', redirectUrl: null, reference: 'TXN_REF_SAMPLE' } as const;
}


