export const sendWelcomeEmail = async (email: string, firstName: string) => {
    const emailTemplate = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Finfy</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header img {
                width: 150px;
            }
            .content {
                padding: 20px;
            }
            .content h1 {
                font-size: 24px;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .features {
                list-style-type: disc;
                margin: 20px 0;
                padding-left: 20px;
            }
            .features li {
                margin-bottom: 10px;
                font-size: 16px;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                background-color: #4A90E2;
                color: #fff !important;
                text-decoration: none;
                padding: 15px 25px;
                border-radius: 5px;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header with logo -->
            <div class="header">
                <img src="https://app.finfy.ai/android-chrome-512x512.png" alt="Finfy Logo">
            </div>
    
            <!-- Email content -->
            <div class="content">
                <h1>Hi ${firstName},</h1>
                <p>Welcome to Finfy! We're thrilled to have you on board as part of our community. Your account has been successfully registered, and you now have access to a world of intelligent financial management tools.</p>
    
                <p>Finfy is here to help you make smarter financial decisions, track your spending, create budgets, set savings goals, and manage your finances with ease. Here are some things you can do right away:</p>
    
                <!-- Features list -->
                <ul class="features">
                    <li>Track and manage your spending with ease</li>
                    <li>Set and monitor personalized savings goals</li>
                    <li>Get personalized insights and financial advice</li>
                    <li>Automate payments and transactions</li>
                    <li>Visualize your cash flow and investments</li>
                </ul>
    
                <!-- Get Started button -->
                <div class="button-container">
                    <a href="https://www.finfy.com/dashboard/[User_ID]" class="button">Get Started with Finfy</a>
                </div>
    
                <p>If you have any questions or need assistance getting started, our support team is here to help! Simply reach out to us at <a href="mailto:support@finfy.com">support@finfy.com</a>.</p>
    
                <p>Stay tuned for tips and updates to help you make the most of Finfy.</p>
            </div>
    
            <!-- Footer -->
            <div class="footer">
                Welcome aboard,<br>
                The Finfy Team<br>
                <br>
                Finfy | <a href="https://www.finfy.com">www.finfy.com</a><br>
                <a href="https://www.finfy.com/unsubscribe">Unsubscribe</a> | <a href="https://www.finfy.com/privacy-policy">Privacy Policy</a> | <a href="https://www.finfy.com/terms-of-service">Terms of Service</a>
            </div>
        </div>
    </body>
    </html>
    
  `;
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Welcome to Finfy!",
          html: emailTemplate,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
