export const communityOfficerHtmlContent = ({
	invitationLink,
	currentYear,
}: { invitationLink: string; currentYear: number }) => {
	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Help Your Community with MARE!</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 15px !important;
      }
      .step {
        display: block !important;
        width: 100% !important;
        margin-bottom: 20px !important;
      }
      .step-container {
        padding: 0 !important;
      }
      .header-text {
        font-size: 24px !important;
      }
      .community-image {
        width: 100% !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; color: #333333;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email Container -->
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 30px 20px 30px; background-color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <img src="cid:logo" alt="Dewaste MARE! Logo" style="display: block; max-width: 240px; height: auto;" />
            </td>
          </tr>
          
          <!-- Main Banner -->
          <tr>
            <td style="padding: 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #038167; border-radius: 8px;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <h1 class="header-text" style="margin: 0; color: #ffffff; font-size: 32px; line-height: 1.3; text-align: center;">Help Your Community with MARE!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 30px;">
              
              <!-- Introduction Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td>
                    <p style="margin-top: 0; margin-bottom: 15px; line-height: 1.6; font-size: 16px;">Thank you for your interest in helping your community manage waste better through MARE! — our all-in-one, portable materials recovery solution.</p>
                    
                    <p style="margin-top: 0; margin-bottom: 15px; line-height: 1.6; font-size: 16px;">As a <strong>Community Officer</strong>, you'll play a vital role in transforming how your neighborhood handles waste, creating cleaner streets and new opportunities for everyone.</p>
                  </td>
                </tr>
              </table>
              

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="border-bottom: 1px solid #e0e0e0; height: 1px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
              
              <!-- Community Officer Role -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #f0f9f7; border-radius: 8px; border-left: 4px solid #038167;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin-top: 0; margin-bottom: 15px; color: #038167; font-size: 20px; text-align: center;">What Community Officers Do</h2>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 10px; vertical-align: top;">
                          <p style="margin-top: 0; margin-bottom: 10px; line-height: 1.4;"><strong>✓ Lead Local Implementation</strong><br />Coordinate MARE! operations in your area</p>
                        </td>
                        <td width="50%" style="padding-left: 10px; vertical-align: top;">
                          <p style="margin-top: 0; margin-bottom: 10px; line-height: 1.4;"><strong>✓ Mobilize Residents</strong><br />Encourage participation in waste segregation</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding-right: 10px; vertical-align: top;">
                          <p style="margin-top: 0; margin-bottom: 10px; line-height: 1.4;"><strong>✓ Promote Sustainability</strong><br />Educate on proper waste management</p>
                        </td>
                        <td width="50%" style="padding-left: 10px; vertical-align: top;">
                          <p style="margin-top: 0; margin-bottom: 0; line-height: 1.4;"><strong>✓ Create Local Jobs</strong><br />Help employ community members</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Steps to Become a Community Officer -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td>
                    <h2 style="margin-top: 0; margin-bottom: 20px; color: #038167; font-size: 20px; text-align: center;">How to Become a Community Officer</h2>
                  </td>
                </tr>
                
                <!-- Step 1 -->
                <tr>
                  <td class="step-container" style="padding: 10px 0;">
                    <table class="step" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px;">
                      <tr>
                        <td width="60" style="vertical-align: middle; padding: 15px 0 15px 15px;">
                          <div style="background-color: #038167; color: white; width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold;">1</div>
                        </td>
                        <td style="vertical-align: middle; padding: 15px;">
                          <p style="margin: 0; font-weight: bold;">Complete the Community Officer Application Form</p>
                          <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Tell us about yourself and your community</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Step 2 -->
                <tr>
                  <td class="step-container" style="padding: 10px 0;">
                    <table class="step" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px;">
                      <tr>
                        <td width="60" style="vertical-align: middle; padding: 15px 0 15px 15px;">
                          <div style="background-color: #FFC539; color: white; width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold;">2</div>
                        </td>
                        <td style="vertical-align: middle; padding: 15px;">
                          <p style="margin: 0; font-weight: bold;">Submit Your ID and Local Barangay Endorsement</p>
                          <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Provide verification of your identity and community standing</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Step 3 -->
                <tr>
                  <td class="step-container" style="padding: 10px 0;">
                    <table class="step" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px;">
                      <tr>
                        <td width="60" style="vertical-align: middle; padding: 15px 0 15px 15px;">
                          <div style="background-color: #F69C91; color: white; width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold;">3</div>
                        </td>
                        <td style="vertical-align: middle; padding: 15px;">
                          <p style="margin: 0; font-weight: bold;">Join Our Onboarding and Training Session</p>
                          <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Learn how to operate MARE! and engage your community</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Step 4 -->
                <tr>
                  <td class="step-container" style="padding: 10px 0;">
                    <table class="step" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; border-radius: 8px;">
                      <tr>
                        <td width="60" style="vertical-align: middle; padding: 15px 0 15px 15px;">
                          <div style="background-color: #038167; color: white; width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold;">4</div>
                        </td>
                        <td style="vertical-align: middle; padding: 15px;">
                          <p style="margin: 0; font-weight: bold;">Start Running MARE! in Your Area</p>
                          <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Begin making a difference in your community</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              

              
              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #038167; border-radius: 6px; padding: 0;">
                          <a href="${invitationLink}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px;">APPLY TO BE A COMMUNITY OFFICER</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #038167; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; padding: 25px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: center; color: #ffffff; font-size: 16px;">
                    <p style="margin: 0; line-height: 1.6;"><strong>Together, we can make waste segregation a daily habit in every home.</strong></p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; color: #ffffff; padding-top: 20px; font-size: 14px;">
                    <p style="margin: 0;">Contact us: <a href="mailto:support@dewaste.solutions" style="color: #ffffff; text-decoration: underline;">support@dewaste.solutions</a></p>
                    <p style="margin: 10px 0 0 0;">© ${currentYear} Dewaste. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
};
