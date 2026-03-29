import ProductsPage from "./productPage";


export default function Page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return <ProductsPage initialCategory={searchParams.category} />;
}