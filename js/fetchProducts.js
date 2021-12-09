async function fetchProducts(query) {
  const fetchResponse = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const responseJSON = await fetchResponse.json();
  return responseJSON;
}