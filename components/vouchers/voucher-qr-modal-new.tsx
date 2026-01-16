'use client';

import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import QRCode from 'qrcode';
import { useEffect } from 'react';

interface VoucherQRModalProps {
  voucherId: string;
  qrCodeData: string | null;
  pinCode: string;
  title: string;
  shopName: string;
}

export function VoucherQRModal({
  voucherId,
  qrCodeData,
  pinCode,
  title,
  shopName,
}: VoucherQRModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && qrCodeData) {
      generateQRCode();
    }
  }, [open, qrCodeData]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(qrCodeData || pinCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
          <QrCode className="h-4 w-4 mr-2" />
          Show QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-white/60">
            {shopName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {qrCodeUrl && (
            <div className="bg-white p-4 rounded-lg">
              <img src={qrCodeUrl} alt="Voucher QR Code" className="w-full" />
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm">PIN Code</p>
            <p className="text-white font-mono text-3xl tracking-wider">{pinCode}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-white/60 text-xs text-center">
              Show this QR code or PIN to the shop employee to redeem your voucher
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
