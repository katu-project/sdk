const PACKAGE_VER_LENGTH = 8
const VERSION_MARK = '0000952700004396'
const metaInfo = {
    salt2: 8,
    flag: 4,
    edl: 4
}
const flagInfo = {
  ccv_idx: 7
}

const cryptoAlgorithm = {
    cryptoMethod: 'AES_256_CBC'
}

async function createPlaintext(imageData, extraData) {
    return imageData.concat(extraData)
}

async function separatePlaintext(plaintext, packageHex){
    const { edSize } = await _getImageInfo(packageHex)
    return {
        image: edSize ? plaintext.slice(0, -edSize) : plaintext,
        extraData: edSize ? plaintext.slice(-edSize) : ''
    }
}

async function createMetaData({salt, edhl, ccv}) {
    const cf = ccv ? ccv.slice('v'.length) : '0'
    const flag = [0,0,0,0,0,0,0,0]
    flag[flagInfo.ccv_idx] = cf
    let edl = '00000000'
    if(edhl > 0) {
        edl = edhl.toString().padStart(8,'0')
    }
    return salt.concat(flag.join('')).concat(edl).concat(VERSION_MARK)
}

async function extractEncryptedData(imageHexData) {
    const { imageSize, edSize } = await _getImageInfo(imageHexData)
    return imageHexData.slice(0, imageSize + edSize )
}

async function extractMetaData(metaData){
    const salt = metaData.slice(0, metaInfo.salt2*2)
    const flag = metaData.slice(metaInfo.salt2*2, (metaInfo.salt2+metaInfo.flag)*2)
    const ccv = 'v' + flag[flagInfo.ccv_idx]
    const edl = metaData.slice(-metaInfo.edl*2)
    const edSize = parseInt(edl)
    return {
      salt,
      flag,
      edl,
      edSize,
      ccv
    }
}

async function _getImageInfo(packageHex){
    const fileByteSize = packageHex.length / 2
    const metaDataLen = Object.values(metaInfo).reduce((a,b)=>a+b)
    const mixDataByteSize = fileByteSize - metaDataLen - PACKAGE_VER_LENGTH
    const metaDataHex = packageHex.slice(mixDataByteSize * 2, (mixDataByteSize + metaDataLen) * 2)
    const metaData = await extractMetaData(metaDataHex)
    const imageSize = mixDataByteSize * 2 - metaData.edSize
    return Object.assign(metaData,{
      imageSize
    })
}

module.exports = {
    ver: 'v0',
    dea: cryptoAlgorithm,
    cpt: createPlaintext,
    cmd: createMetaData,
    eed: extractEncryptedData,
    spt: separatePlaintext,
    emd: extractMetaData
}