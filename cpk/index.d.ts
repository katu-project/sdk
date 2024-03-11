interface cryptoAlgorithm {
    cryptoMethod: string
}

interface createPlaintext {
    (imageData:string, extraData:string): Promise<string>
}

interface separatePlaintext {
    (plaintext:string, packageHex:string): Promise<{
        image: string
        extraData: string
    }>
}


interface IMetaDataOptions {
    salt: string
    edhl: number
    ccv: string
}

interface createMetaData {
    (options:IMetaDataOptions): Promise<string>
}

interface extractEncryptedData {
    (imageHexData:string): Promise<string>
}

interface extractMetaData {
    (metaHexData:string): Promise<any>
}

interface ICryptoPackage {
    ver: string,
    dea: cryptoAlgorithm,
    cpt: createPlaintext,
    cmd: createMetaData,
    eed: extractEncryptedData,
    spt: separatePlaintext,
    emd: extractMetaData,
}

declare namespace cpk {
    function getCpk(ver: string): ICryptoPackage;
    function getPackageCpk(pkgHex: string, signLen?: number): Promise<ICryptoPackage>;
}

export = cpk