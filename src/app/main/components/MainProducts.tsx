import MainProductsClient from "./MainProductsClient";
import { fetchProductGroups } from "./mainProductsData";

export default async function MainProducts() {
  const groups = await fetchProductGroups().catch(() => []);

  if (groups.length === 0) {
    return null;
  }

  return <MainProductsClient groups={groups} />;
}
