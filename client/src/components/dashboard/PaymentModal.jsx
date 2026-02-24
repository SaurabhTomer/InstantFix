import React, { useState } from 'react';
import { FaCreditCard, FaTimes, FaRupeeSign, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  requestId, 
  amount, 
  electricianName,
  serviceType,
  onPaymentSuccess 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      console.log('Creating payment order for:', { requestId, amount });
      
      // Use Razorpay without order_id (simpler approach)
      console.log('Initializing Razorpay payment without order...');
      
      // Load Razorpay script
      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        
        const options = {
          key: 'rzp_test_1DP5mmOlF5G5ag', // Test key
          amount: amount * 100, // Convert to paisa
          currency: 'INR',
          name: 'InstantFix',
          description: `Payment for ${serviceType} service`,
          image: 'https://example.com/your-logo.png', // Optional logo
          handler: async function (response) {
            console.log('Payment successful:', response);
            
            // Simulate successful payment
            setPaymentCompleted(true);
            toast.success('Payment completed successfully!');
            onPaymentSuccess({ 
              id: response.razorpay_payment_id || `payment_${Date.now()}`, 
              status: 'paid',
              amount: amount,
              orderId: response.razorpay_order_id
            });
            
            // Close modal after 2 seconds
            setTimeout(() => {
              onClose();
              setPaymentCompleted(false);
            }, 2000);
            
            setIsProcessing(false);
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999'
          },
          notes: {
            address: 'Razorpay Corporate Office',
            requestId: requestId
          },
          theme: {
            color: '#fbbf24'
          },
          modal: {
            ondismiss: function() {
              console.log('Razorpay modal dismissed');
              setIsProcessing(false);
            },
            escape: true,
            backdropclose: true
          }
        };

        console.log('Creating Razorpay instance with options:', options);
        
        // Check if Razorpay is available
        if (window.Razorpay) {
          try {
            const rzp = new window.Razorpay(options);
            console.log('Razorpay instance created, opening checkout...');
            rzp.open();
          } catch (error) {
            console.error('Error creating Razorpay instance:', error);
            toast.error('Failed to initialize payment gateway');
            setIsProcessing(false);
          }
        } else {
          console.error('Razorpay not available');
          toast.error('Payment gateway not available');
          setIsProcessing(false);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
      };
      
      document.body.appendChild(script);
      console.log('Razorpay script appended to document');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your payment of ₹{amount} has been completed successfully.
          </p>
          <div className="text-sm text-gray-500">
            Transaction ID: TXN{Date.now()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Service:</span>
              <span className="font-medium text-gray-800">{serviceType}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Electrician:</span>
              <span className="font-medium text-gray-800">{electricianName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Request ID:</span>
              <span className="font-medium text-gray-800">#{requestId.slice(-6)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaRupeeSign className="w-5 h-5 mr-1" />
                  {amount}
                </p>
              </div>
              <FaCreditCard className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            Secure payment powered by Razorpay
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">🔒</span>
            </div>
            Your payment information is encrypted and secure
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard className="w-4 h-4" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
