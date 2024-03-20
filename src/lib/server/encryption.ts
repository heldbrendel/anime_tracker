import crypto from 'crypto';
import { env } from '$env/dynamic/private';

const secretKey = env.SECRET_KEY;
const secretIV = env.SECRET_IV;
const encryptionMethod = env.ENCRYPTION_METHOD;

if (!secretKey) {
	throw new Error('env var SECRET_KEY is required');
}
if (!secretIV) {
	throw new Error('env var SECRET_IV is required');
}
if (!encryptionMethod) {
	throw new Error('env var ENCRYPTION_METHOD is required');
}

const key = crypto
	.createHash('sha512')
	.update(secretKey)
	.digest('hex')
	.substring(0, 32);
const encryptionIV = crypto
	.createHash('sha512')
	.update(secretIV)
	.digest('hex')
	.substring(0, 16);

export function encryptData(data: string) {
	const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV);
	return Buffer.from(
		cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
	).toString('base64');
}

export function decryptData(encryptedData: string) {
	const buff = Buffer.from(encryptedData, 'base64');
	const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIV);
	return (
		decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
		decipher.final('utf8')
	);
}
