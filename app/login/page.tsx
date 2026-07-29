import { Metadata } from 'next';
import LoginForm from "../../components/loginForm";

export const metadata: Metadata = {
  title: 'Sign In | Emisco Account Access',
  description: 'Log in to your Emisco Investment Limited account to track orders, manage delivery addresses, and view purchase history.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <LoginForm callbackUrl={callbackUrl} />;
}