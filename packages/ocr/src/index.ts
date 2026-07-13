import { TextractClient, AnalyzeDocumentCommand, FeatureType } from '@aws-sdk/client-textract';

export interface OcrReceiptItem {
  description: string;
  price: number;
  rawLineText: string;
}

export interface OcrReceiptResult {
  storeName?: string;
  transactionDate?: Date;
  items: OcrReceiptItem[];
}

export class ReceiptOcrService {
  private client: TextractClient;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.client = new TextractClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Sends receipt image buffer to AWS Textract for parsing layout and line text features.
   */
  async processReceipt(imageBuffer: Buffer): Promise<OcrReceiptResult> {
    const command = new AnalyzeDocumentCommand({
      Document: {
        Bytes: imageBuffer,
      },
      FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
    });

    try {
      const response = await this.client.send(command);
      const blocks = response.Blocks || [];
      
      const lines = blocks
        .filter(b => b.BlockType === 'LINE')
        .map(b => b.Text || '');

      return this.parseReceiptLines(lines);
    } catch (error) {
      console.error('Error analyzing receipt with AWS Textract:', error);
      throw error;
    }
  }

  /**
   * Helper parsing algorithm to isolate products and matching prices.
   */
  private parseReceiptLines(lines: string[]): OcrReceiptResult {
    const items: OcrReceiptItem[] = [];
    let storeName: string | undefined;

    // Usually the first non-empty line of the receipt is the store name
    if (lines.length > 0) {
      storeName = lines[0];
    }

    // RegEx checking typical pricing structures (e.g. 3.99, 12.50, $4.99)
    const priceRegex = /([0-9]+\.[0-9]{2})$/;

    lines.forEach(line => {
      const match = line.match(priceRegex);
      if (match) {
        const price = parseFloat(match[1]);
        // Strips price and optional currency symbols to isolate item text
        const description = line.replace(match[0], '').replace('$', '').trim();
        
        // Exclude common total/tax summaries
        const isSummaryLine = /total|tax|subtotal|change/i.test(description);
        if (description.length > 2 && !isSummaryLine) {
          items.push({
            description,
            price,
            rawLineText: line,
          });
        }
      }
    });

    return {
      storeName,
      transactionDate: new Date(),
      items,
    };
  }
}
