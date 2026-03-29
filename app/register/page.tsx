import RegisterForm from "./registerform";


export default function Page({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  return <RegisterForm callbackUrl={searchParams.callbackUrl} />;
}