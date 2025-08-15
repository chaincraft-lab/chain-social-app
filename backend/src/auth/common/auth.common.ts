import * as bcrypt from 'bcrypt';

export async function hashPasswordFunc(password: string) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function isPasswordMatch(payloadPass: string, userPass: string) {
  return await bcrypt.compare(payloadPass, userPass);
}
