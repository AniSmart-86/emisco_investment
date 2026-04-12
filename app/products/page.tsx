import ProductsPage from "./productPage";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  return <ProductsPage initialCategory={category} initialSearch={search} />;
}