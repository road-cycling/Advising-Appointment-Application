

module.exports = min_type => {
  return (ctx, next) => {
    console.log(`min_type in authorize is ${min_type}`)
    if (min_type !== 'admin') {
      return false;
    }
    return next()
  }
}
