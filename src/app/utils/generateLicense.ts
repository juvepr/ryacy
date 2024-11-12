// /app/utils/generateLicense.ts
interface KeyAuthResponse {
    success: boolean;
    message: string;
    info?: string;
  }
  
  export async function generateLicense(keyAuthLevel: string): Promise<string> {
    try {
      const sellerKey = process.env.KEYAUTH_SELLER_KEY;
      const params = new URLSearchParams({
        sellerkey: sellerKey || '',
        type: 'add',
        format: 'JSON',
        expiry: '0', // lifetime
        mask: '******-******-******',
        level: keyAuthLevel,
        amount: '1',
        character: '1',
        note: `Generated from Ryacy Solutions purchase`
      });
  
      const url = `https://keyauth.win/api/seller/?${params.toString()}`;
      
      const headers = new Headers();
      headers.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
  
      console.log('Making KeyAuth request:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json() as KeyAuthResponse;
      console.log('KeyAuth Response:', data);
  
      if (data.success) {
        return data.info || '';
      }
      
      throw new Error(data.message || 'Failed to generate license key');
    } catch (error) {
      console.error('KeyAuth Error:', error);
      throw error;
    }
  }
  