const emptyResponse = {
  street: "",
  street_number: "",
  neighbourhood: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Brasil",
};

export function parseAddress(addressString?: string) {
  if (!addressString) return emptyResponse;

  const address = addressString
    .replaceAll("S/N", "")
    .replaceAll("s/n", "")
    .split(", ");

  if (address.length === 0) return emptyResponse;

  let street = address[0];
  let street_number = "";
  let neighbourhood = "";
  let city = "";
  let state = "";
  let postal_code = "";

  try {
    // street, street Number, neighbourhood, city, state thing
    const lastComponent = address[address.length - 1];
    const temp = lastComponent.split(" ");
    if (["brasil"].includes(temp[temp.length - 1].toLowerCase())) {
      temp.pop();
    }

    if (temp.length === 1) state = temp[0];

    temp.map((val) => {
      if (val.match(/^[0-9\-]+$/g)) {
        postal_code = val;
      }
    });

    state = temp.join(" ").replaceAll(postal_code, "");

    address.pop();

    if (address.length > 1) {
      city = address[address.length - 1];
      address.pop();
    }

    if (address.length > 1) {
      const secondIndexItem = address[1];
      const containsDigit = secondIndexItem.match(/.*\d.*/);
      if (address.length === 2) {
        if (!containsDigit) {
          neighbourhood = address[1];
        } else {
          street_number = address[1];
        }
      } else if (address.length === 3) {
        street_number = address[1];
        neighbourhood = address[2];
      }
    }
  } catch (err) {
    // console.log(err);
  }

  return {
    street: street,
    street_number: street_number,
    neighbourhood: neighbourhood,
    city: city,
    state: state,
    postal_code: postal_code,
    country: "Brasil",
  };
}
