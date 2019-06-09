const isInvalidAd = (req) => {
  const rs = [];
  if (!req.site) {
    rs.push("Missing site field.");
  } else {
    if (!req.site.id) {
      rs.push("Missing site.id field.");
    }
    if (!req.site.page) {
      rs.push("Missing site.page.");
    }
  }
  if (!req.device) {
    rs.push("Missing device field.")
  } else if (!req.device.ip) {
    rs.push("Missing device.ip field.")
  }

  if (rs.length != 0) {
    return rs.join(" ");
  }
  return "";
}

module.exports = { isInvalidAd };