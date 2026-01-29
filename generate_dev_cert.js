const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

// Target directory requested by user
const targetDir = path.join(__dirname, 'src/Utils/DigitalSign');

// Ensure directory exists
if (!fs.existsSync(targetDir)){
    console.log(`Creating directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
}

function generateP12() {
  console.log('Generating self-signed RSA key pair (this may take a moment)...');
  const keys = forge.pki.rsa.generateKeyPair(2048);
  
  console.log('Creating certificate...');
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1); // Valid for 1 year

  const attrs = [{
    name: 'commonName',
    value: 'CertiGo Development Authority'
  }, {
    name: 'countryName',
    value: 'PH'
  }, {
    shortName: 'ST',
    value: 'Metro Manila'
  }, {
    name: 'organizationName',
    value: 'CertiGo Developers'
  }, {
    shortName: 'OU',
    value: 'IT'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }]);

  // Sign certificate
  cert.sign(keys.privateKey);

  console.log('Packaging into PKCS#12 format...');
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    keys.privateKey,
    [cert],
    'password', // Standard dev password
    {algorithm: '3des'} // Triple DES encryption for compatibility
  );

  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
  const p12Buffer = Buffer.from(p12Der, 'binary');

  const outputPath = path.join(targetDir, 'certificate.p12');
  fs.writeFileSync(outputPath, p12Buffer);
  
  console.log(`✅ Success! Certificate generated at: ${outputPath}`);
  console.log('🔑 Password: "password"');
}

try {
    generateP12();
} catch (error) {
    console.error('Failed to generate certificate:', error);
}
