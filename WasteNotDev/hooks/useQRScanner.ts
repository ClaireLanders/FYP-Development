// TODO: ADD DESCRIPTION AND SOURCES
// TODO: Comments fix !!
// Manages QR state and logic
import { useState } from 'react';
import { pickupService, VerifyPickupResponse } from '../services/pickupService';

interface ScannerState {
  isScanning: boolean;
  isVerifying: boolean;
  verificationResult: VerifyPickupResponse | null;
  error: string | null;
}

export const useQRScanner = (userBranchId: string) => {
  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    isVerifying: false,
    verificationResult: null,
    error: null,
  });

  // Start the camera scanner
  const startScanning = () => {
    setState((prev) => ({
      ...prev,
      isScanning: true,
      error: null,
      verificationResult: null,
    }));
  };

  //Stop the camera scanner

  const stopScanning = () => {
    setState((prev) => ({
      ...prev,
      isScanning: false,
    }));
  };

  // Handle scanned QR code and verify it

  const handleScan = async (qrCode: string) => {
    if (!qrCode || state.isVerifying) return;

    // Stop scanning immediately
    setState((prev) => ({ ...prev, isScanning: false, isVerifying: true }));

    try {
      const result = await pickupService.verifyPickup(qrCode, userBranchId);

      setState((prev) => ({
        ...prev,
        isVerifying: false,
        verificationResult: result,
        error: null,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || err.message || 'Failed to verify pickup';

      setState((prev) => ({
        ...prev,
        isVerifying: false,
        verificationResult: null,
        error: errorMessage,
      }));
    }
  };

  // Reset scanner state (for scanning another QR code)

  const reset = () => {
    setState({
      isScanning: false,
      isVerifying: false,
      verificationResult: null,
      error: null,
    });
  };

  return {
    ...state,
    startScanning,
    stopScanning,
    handleScan,
    reset,
  };
};