async function fetchItem(itemID) {
  const fetchResponse = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const responseJSON = await fetchResponse.json();
  return responseJSON;
}