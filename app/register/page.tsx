import { Metadata } from 'next';
import RegisterForm from "../../components/registerform";

export const metadata: Metadata = {
  title: 'Create an Account | Join Emisco Investment',
  description: 'Register for an account with Emisco Investment Limited to order genuine OEM truck spare parts, save delivery locations, and track logistics.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <RegisterForm callbackUrl={callbackUrl} />;
}