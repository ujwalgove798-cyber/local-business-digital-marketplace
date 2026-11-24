// Razorpay Payment Gateway Client Integration
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayPaymentOptions {
  amount: number; // in INR
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  onSuccess: (paymentDetails: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
  onFailure: (error: any) => void;
  onDismiss?: () => void;
}

export function getRazorpayKey(): string {
  return (
    localStorage.getItem('fashtag_razorpay_key') ||
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    ''
  ).trim();
}

export function saveRazorpayKey(key: string) {
  localStorage.setItem('fashtag_razorpay_key', key.trim());
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment(options: RazorpayPaymentOptions): Promise<{ initiated: boolean; simulated?: boolean; message?: string }> {
  const key = getRazorpayKey();

  // If Razorpay Key is provided, use the real hosted checkout modal
  if (key) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      options.onFailure({ message: 'Failed to load Razorpay SDK. Please check your internet connection.' });
      return { initiated: false, message: 'Razorpay SDK failed to load' };
    }

    try {
      const rzpOptions = {
        key: key,
        amount: Math.round(options.amount * 100), // paise
        currency: 'INR',
        name: 'FASHTAG',
        description: `Order ${options.orderId} - Premium Fashion Store`,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=128&q=80',
        prefill: {
          name: options.customerName,
          email: options.email,
          contact: options.phone.replace(/\D/g, '').slice(-10),
        },
        theme: {
          color: '#d4af37', // Champagne Gold
        },
        modal: {
          ondismiss: () => {
            if (options.onDismiss) options.onDismiss();
          },
        },
        handler: (response: any) => {
          options.onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', (response: any) => {
        options.onFailure(response.error);
      });
      rzp.open();
      return { initiated: true, simulated: false };
    } catch (err: any) {
      options.onFailure(err);
      return { initiated: false, message: err.message };
    }
  }

  // If key is not configured, inform the user with structured sandbox simulator
  return {
    initiated: false,
    simulated: true,
    message: 'Razorpay Key not configured in environment or settings. Sandbox/test checkout active.',
  };
}
