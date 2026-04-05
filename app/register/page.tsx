import RegisterForm from "../../components/registerform";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <RegisterForm callbackUrl={callbackUrl} />;
}