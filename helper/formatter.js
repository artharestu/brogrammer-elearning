const stringSlice = (string, length) => {
  return `${string.slice(0, length)}...`;
};

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("us-US", options);
  /** id-ID dipake untuk membuat format tanggal indonesia
   * dan kalo us-US buat format pake bahasa indo
   */
}

module.exports = {
  stringSlice,
  formatDate,
};
