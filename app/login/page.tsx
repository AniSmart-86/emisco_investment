import LoginForm from "./loginForm";


export default function Page({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  return <LoginForm callbackUrl={searchParams.callbackUrl} />;
}