var AppUtils = {}
AppUtils.LOCALHOST = 'localhost'
AppUtils.isLocalhost = (url) => {
  return /^(http||https):\/\/localhost/.test(url)
}
