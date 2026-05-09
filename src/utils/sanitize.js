const sanitizeInput = (input) => {

  if (typeof input !== "string") {
    return input;
  }

  return input

    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\$/g, "")
    .trim();

};

export  {sanitizeInput};