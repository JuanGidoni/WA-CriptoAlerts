const calculate = (original, newprice) => {
 return (((original-newprice) / original) * 100).toFixed(3)
}

module.exports = {
 calculate
}
