const ERRORS = {
  '1001': {
    message: 'Country code outside US.',
    status: 400
  },
  '1002': {
    message: 'Error retrieving country code.',
    status: 500
  },
  '1005': {
    message: 'Error retrieving publisher.',
    status: 500
  },
  '1006': {
    message: 'Publisher not exist.',
    status: 400
  }
}

ERRORS.error = (code, ex) => {
  const err = new Error();
  if (!code || !code.message) {
    err.message = "Internal server error";
    err.status = 500;
    err.exception = ex ? ex.message : ""
  } else {
    err.message = code.message;
    err.status = code.status;
    err.exception = ex ? ex.message: ""
  }
  return err;
}


module.exports = ERRORS;