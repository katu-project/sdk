const cpks = {
    v0: require('./v0')
}
const PACKAGE_SIGN_LENGTH = 8

function signToImportKey(sign){
    return 'v' + parseInt(sign.slice(0,4)).toString()
}

const getCpk = exports.getCpk = ver => {
    if(!cpks[`${ver}`]) throw Error('无此 cpk')
    return cpks[`${ver}`]
}

exports.getPackageCpk = async (pkgHex, signLen=PACKAGE_SIGN_LENGTH) => {
    const cpkSign = pkgHex.slice(-signLen)
    const cpk = signToImportKey(cpkSign)
    return getCpk(cpk)
}