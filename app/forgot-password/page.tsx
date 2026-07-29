import { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password | Emisco Investment',
  description: 'Reset your Emisco Investment account password securely using a 6-digit OTP verification code.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
