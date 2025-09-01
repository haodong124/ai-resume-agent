// packages/security/src/DataEncryption.ts
import crypto from 'crypto'

export class DataEncryption {
  private readonly algorithm = 'aes-256-gcm'
  
  constructor(private secretKey: string) {}

  // 加密数据
  encrypt(data: any): string {
    const text = JSON.stringify(data)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.secretKey)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return iv.toString('hex') + ':' + encrypted
  }

  // 解密数据
  decrypt(encryptedData: string): any {
    const [ivHex, encrypted] = encryptedData.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return JSON.parse(decrypted)
  }
}

// 数据脱敏
export class DataMasking {
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@')
    const masked = username.slice(0, 2) + '***'
    return `${masked}@${domain}`
  }

  static maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
}
