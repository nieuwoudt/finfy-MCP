import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/utils/helpers";
import { FingoalClient } from "./fingoal-integration";

// Type definitions for our data structures
interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface Transaction {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  [key: string]: any;
}

interface Account {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  balance_amount?: number;
  balance_currency?: string;
  provider_name?: string;
  [key: string]: any;
}

interface UserTag {
  id: string;
  user_id: string;
  tag_name: string;
  tag_definition?: string;
  group?: string;
  use_cases?: string;
  created_at: string;
  updated_at: string;
}

interface TransactionEnrichment {
  [transactionId: string]: {
    tags?: string[];
    categories?: string[];
    insights?: string[];
    [key: string]: any;
  };
}

interface ToolArgs {
  user_id: string;
  max_tokens?: number;
}

interface ToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

/**
 * FinifyMcpServer - Finfy's Model Context Protocol Server implementation
 * 
 * This class is responsible for:
 * 1. Setting up the MCP server
 * 2. Registering tools (primarily get_context_block)
 * 3. Retrieving and formatting financial data for LLM context
 */
export class FinifyMcpServer {
  private server: Server;
  private transport: StdioServerTransport;
  private tools: Map<string, (args: ToolArgs) => Promise<ToolResult>>;
  private fingoalClient: FingoalClient | null = null;

  constructor() {
    this.transport = new StdioServerTransport();
    this.tools = new Map();
    
    this.server = new Server({
      name: "finfy-server",
      version: "1.0.0"
    }, {
      capabilities: {
        resources: {},
        tools: {}
      }
    });

    // Initialize Fingoal client if credentials are available
    const clientId = process.env.FINGOAL_CLIENT_ID;
    const clientSecret = process.env.FINGOAL_CLIENT_SECRET;
    if (clientId && clientSecret) {
      this.fingoalClient = new FingoalClient(
        clientId,
        clientSecret,
        process.env.NODE_ENV === "production"
      );
    }

    this.registerTools();
  }

  /**
   * Register all available tools on the MCP server
   */
  private registerTools() {
    // Register our primary tool - get_context_block
    const getContextBlockTool = async ({ user_id, max_tokens = 1000000 }: ToolArgs): Promise<ToolResult> => {
      try {
        // 1. Fetch user profile info
        const userContext = await this.getUserProfile(user_id);
        
        // 2. Fetch user's transactions (last 24 months)
        const transactions = await this.getTransactions(user_id);
        
        // 3. Fetch user's accounts
        const accounts = await this.getAccounts(user_id);
        
        // 4. Get Fingoal data if available
        let userTags: UserTag[] = [];
        let transactionEnrichment: TransactionEnrichment = {};
        
        if (this.fingoalClient) {
          try {
            // Get user tags from Fingoal
            const fingoalUserData = await this.fingoalClient.getUserTags(user_id);
            userTags = fingoalUserData.user.tags.map(tag => ({
              id: tag.id,
              user_id,
              tag_name: tag.name,
              tag_definition: tag.tag_description,
              group: tag.tag_type,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));

            // Check if we have transaction enrichment data in our cache
            const transactionIds = transactions.map(tx => tx.id);
            const { data: enrichmentData, error: enrichmentError } = await supabase
              .from("transaction_tags")
              .select("*")
              .in("transaction_id", transactionIds);
            
            if (enrichmentError) {
              console.error("Error fetching transaction enrichment:", enrichmentError);
            } else if (enrichmentData && enrichmentData.length > 0) {
              // Group enrichment data by transaction ID
              transactionEnrichment = {};
              for (const item of enrichmentData) {
                const txId = item.transaction_id;
                if (!transactionEnrichment[txId]) {
                  transactionEnrichment[txId] = { tags: [] };
                }
                
                // Use non-null assertion since we just created it if it didn't exist
                (transactionEnrichment[txId]!.tags || []).push(item.tag);
              }
            }

            // For transactions without enrichment, send them for processing
            const unenrichedTransactions = transactions.filter(tx => 
              !transactionEnrichment[tx.id] || 
              !transactionEnrichment[tx.id].tags ||
              transactionEnrichment[tx.id].tags.length === 0
            );
            
            if (unenrichedTransactions.length > 0) {
              const fingoalTransactions = unenrichedTransactions.map(tx => ({
                uid: user_id,
                accountid: tx.account_id || "",
                amountnum: tx.amount || 0,
                date: tx.date,
                original_description: tx.description || "",
                transactionid: tx.id,
                accountType: tx.account_type || "unknown",
                settlement: tx.amount < 0 ? "debit" : "credit"
              }));

              // Send transactions for enrichment (asynchronous)
              console.log(`Sending ${fingoalTransactions.length} transactions for enrichment`);
              const enrichResponse = await this.fingoalClient.enrichTransactions(fingoalTransactions);
              
              // Store batch ID for later retrieval via webhook
              const { error: batchError } = await supabase
                .from("enrichment_batches")
                .insert({
                  batch_id: enrichResponse.status.batch_request_id,
                  status: "processing",
                  transaction_count: fingoalTransactions.length,
                  created_at: new Date().toISOString()
                });
                
              if (batchError) {
                console.error("Error storing batch ID:", batchError);
              }
            }
          } catch (error) {
            console.error("Error getting Fingoal data:", error);
            // Continue without Fingoal data
          }
        }
        
        // 5. Format everything into a readable context block
        const contextBlock = this.formatContextBlock(
          userContext, 
          transactions, 
          accounts, 
          userTags,
          transactionEnrichment
        );
        
        return {
          content: [
            {
              type: "text",
              text: contextBlock
            }
          ]
        };
      } catch (error) {
        console.error("Error generating context block:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${getErrorMessage(error)}`
            }
          ],
          isError: true
        };
      }
    };

    this.tools.set("get_context_block", getContextBlockTool);
  }

  /**
   * Fetch user profile data from Supabase
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      return data || {} as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {} as UserProfile;
    }
  }

  /**
   * Fetch user transactions from the last 24 months
   */
  private async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      // Calculate date 24 months ago
      const twoYearsAgo = new Date();
      twoYearsAgo.setMonth(twoYearsAgo.getMonth() - 24);
      const twoYearsAgoStr = twoYearsAgo.toISOString().split('T')[0];
      
      // Fetch transactions
      const { data, error } = await supabase
        .from("transactions_yodlee")
        .select("*")
        .eq("user_id", userId)
        .gte("date", twoYearsAgoStr)
        .order("date", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  /**
   * Fetch user's accounts
   */
  private async getAccounts(userId: string): Promise<Account[]> {
    try {
      const { data, error } = await supabase
        .from("accounts_yodlee")
        .select("*")
        .eq("user_id", userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return [];
    }
  }

  /**
   * Format financial data into a user-friendly markdown context block
   */
  private formatContextBlock(
    userProfile: UserProfile, 
    transactions: Transaction[], 
    accounts: Account[], 
    userTags: UserTag[], 
    transactionEnrichment: TransactionEnrichment
  ): string {
    // Start building the markdown
    let markdown = "# Financial Context Block\n\n";

    // Add user info section
    markdown += "## User Profile\n";
    markdown += `- **User ID**: ${userProfile.id || "Unknown"}\n`;
    markdown += `- **Name**: ${userProfile.full_name || "Unknown"}\n`;
    markdown += `- **Email**: ${userProfile.email || "Unknown"}\n`;
    
    // Add user tags if available
    if (userTags && userTags.length > 0) {
      markdown += "\n## User Tags\n";
      markdown += "These tags represent user financial behaviors and patterns:\n\n";
      
      for (const tag of userTags) {
        markdown += `- **${tag.tag_name}**`;
        if (tag.tag_definition) {
          markdown += `: ${tag.tag_definition}`;
        }
        markdown += "\n";
      }
    }

    // Add account summary
    markdown += "\n## Account Summary\n";
    if (accounts && accounts.length > 0) {
      markdown += "| Account Name | Type | Balance | Currency |\n";
      markdown += "|--------------|------|---------|----------|\n";
      
      for (const account of accounts) {
        markdown += `| ${account.account_name || "Unknown"} | ${account.account_type || "Unknown"} | ${account.balance_amount || "N/A"} | ${account.balance_currency || "N/A"} |\n`;
      }
    } else {
      markdown += "*No accounts found*\n";
    }

    // Add recent transactions summary
    markdown += "\n## Recent Transactions\n";
    if (transactions && transactions.length > 0) {
      markdown += "| Date | Description | Amount | Category | Tags |\n";
      markdown += "|------|-------------|--------|----------|------|\n";
      
      // Display most recent 10 transactions
      const recentTransactions = transactions.slice(0, 10);
      
      for (const tx of recentTransactions) {
        // Get any enrichment data for this transaction
        const enrichment = transactionEnrichment[tx.id] || {};
        const tags = enrichment.tags ? enrichment.tags.join(", ") : "";
        
        markdown += `| ${tx.date} | ${tx.description || "Unknown"} | ${tx.amount} ${tx.currency || "USD"} | ${tx.category || "Unknown"} | ${tags} |\n`;
      }
      
      // Add transaction count summary
      markdown += `\n*Total transactions: ${transactions.length}*\n`;
    } else {
      markdown += "*No recent transactions found*\n";
    }

    // Add spending summary for the last month
    markdown += "\n## Monthly Spending Summary\n";
    if (transactions && transactions.length > 0) {
      // Calculate date for the last month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthFormatted = lastMonth.toISOString().split('T')[0].substr(0, 7); // YYYY-MM
      
      // Filter transactions for last month
      const lastMonthTransactions = transactions.filter(tx => tx.date.startsWith(lastMonthFormatted));
      
      // Group by category and sum amounts
      const categorySpending: Record<string, number> = {};
      for (const tx of lastMonthTransactions) {
        const category = tx.category || "Unknown";
        if (!categorySpending[category]) {
          categorySpending[category] = 0;
        }
        categorySpending[category] += Math.abs(tx.amount);
      }
      
      // Display category spending
      markdown += "| Category | Amount Spent |\n";
      markdown += "|----------|-------------|\n";
      
      for (const [category, amount] of Object.entries(categorySpending)) {
        markdown += `| ${category} | ${amount.toFixed(2)} |\n`;
      }
      
      // Calculate total spending
      const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
      markdown += `\n*Total Spending for ${lastMonthFormatted}: ${totalSpending.toFixed(2)}*\n`;
    } else {
      markdown += "*No transactions found for spending summary*\n";
    }

    return markdown;
  }

  /**
   * Directly call a tool for testing purposes
   */
  async callToolDirectly(toolName: string, args: ToolArgs): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return tool(args);
  }

  /**
   * Initialize the MCP server
   */
  async initialize() {
    await this.server.connect(this.transport);
    console.log("Finfy MCP server initialized");
    return this;
  }

  /**
   * Close the MCP server
   */
  async close() {
    await this.server.close();
  }
} 