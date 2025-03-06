
import { Mailchain } from '@mailchain/sdk';

// Initialize Mailchain client
let mailchainClient: Mailchain | null = null;

/**
 * Initialize the Mailchain client with user credentials
 * @param secretRecoveryPhrase - The secret recovery phrase for the user
 * @returns The initialized Mailchain client
 */
export const initializeMailchain = async (secretRecoveryPhrase: string): Promise<Mailchain> => {
  try {
    if (!mailchainClient) {
      mailchainClient = Mailchain.fromSecretRecoveryPhrase(secretRecoveryPhrase);
      console.log('Mailchain client initialized successfully');
    }
    return mailchainClient;
  } catch (error) {
    console.error('Failed to initialize Mailchain client:', error);
    throw error;
  }
};

/**
 * Send a message using Mailchain
 * @param toAddress - Recipient address
 * @param subject - Email subject
 * @param content - Email content (HTML)
 * @param fromAddress - Sender address (optional)
 * @returns The result of the send operation
 */
export const sendMailchainMessage = async (
  toAddress: string, 
  subject: string, 
  content: string,
  fromAddress?: string
) => {
  try {
    if (!mailchainClient) {
      throw new Error('Mailchain client not initialized. Call initializeMailchain first.');
    }

    // If fromAddress is not provided, use the default sender
    const sender = fromAddress || await mailchainClient.user.default();
    
    const result = await mailchainClient.sendMail({
      from: sender,
      to: [toAddress],
      subject,
      content: {
        html: content,
        text: content.replace(/<[^>]*>?/gm, '') // Simple HTML to text conversion
      }
    });

    console.log('Message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

/**
 * Get the user's default Mailchain address
 * @returns The default address if available
 */
export const getDefaultMailchainAddress = async (): Promise<string | null> => {
  try {
    if (!mailchainClient) {
      return null;
    }
    return await mailchainClient.user.default();
  } catch (error) {
    console.error('Failed to get default address:', error);
    return null;
  }
};
