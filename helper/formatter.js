const stringSlice = (string, length) => {
  return `${string.slice(0, length)}...`
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("us-US", options);
}

module.exports = {
  stringSlice, formatDate
}