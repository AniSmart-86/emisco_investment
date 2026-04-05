import ProductsPage from "./productPage";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <ProductsPage initialCategory={category} />;
}