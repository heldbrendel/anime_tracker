import { describe, it, expect, test } from 'vitest';
import { decryptData, encryptData } from '$lib/server/encryption';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

test('test encryption and decryption', () => {
		const s = 'Hello World!';
		const encryptedString = encryptData(s);
		const decryptedString = decryptData(encryptedString);
		expect(decryptedString).toBe(s);
	}
);
