// import OrderConfirmationPage from "../../components/order-confirm";


// export default async function ConfirmPayment({searchParams}: {searchParams: Promise<{ [key: string]: string}>}){

//   const { reference } = await searchParams;

//      const res = await fetch(`http://localhost:3000/api/payments/verify/${reference}`,{
//      method: 'GET',
//     headers: {
//     Authorization: 'Bearer sk_test_f838f9ca975fa9754068552cd3441954e2c04513',
//     'Content-Type': 'application/json',
//     },
// })

// const result = await res.json();
// console.log("reference gotten",result);


// return (
//   <OrderConfirmationPage reference={reference} amount={result.data.amount} email={result.data.customer.email}/>
// )
// }


import OrderConfirmationPage from "../../components/order-confirm";

export default async function ConfirmPayment({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; orderId?: string }>;
}) {
  const { reference, orderId } = await searchParams;


  if (!reference || !orderId) {
    return <div>Invalid payment request</div>;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify/${reference}`, {

    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reference,
      orderId,
    }),
    cache: 'no-store',
  });

  const result = await res.json();

  return (
    <OrderConfirmationPage
      reference={reference}
      orderId={orderId}
      amount={result.data.amount}
      email={result.data.customer.email}
    />
  );
}
