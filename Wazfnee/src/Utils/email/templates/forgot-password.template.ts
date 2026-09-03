export const generateForgotPasswordHTML = (firstName = '', otp = ''): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Wazfnee - Reset Password</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f5f7;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background-color: #f4f5f7; padding: 40px 0;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 600px;
                  width: 100%;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #2563eb;
                      padding: 30px;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                      "
                    >
                      Wazfnee
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 40px;
                    "
                  >
                    <h2
                      style="
                        margin: 0 0 20px;
                        color: #1f2937;
                        font-size: 24px;
                      "
                    >
                      Reset Your Password
                    </h2>

                    <p
                      style="
                        margin: 0 0 10px;
                        color: #4b5563;
                        font-size: 16px;
                      "
                    >
                      Hello <strong>${firstName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 25px;
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      We received a request to reset your Wazfnee
                      account password. Use the verification code below
                      to continue.
                    </p>

                    <!-- OTP -->
                    <div
                      style="
                        display: inline-block;
                        padding: 18px 35px;
                        margin-bottom: 25px;
                        background-color: #eff6ff;
                        border: 2px dashed #2563eb;
                        border-radius: 10px;
                      "
                    >
                      <span
                        style="
                          color: #2563eb;
                          font-size: 32px;
                          font-weight: bold;
                          letter-spacing: 8px;
                        "
                      >
                        ${otp}
                      </span>
                    </div>

                    <p
                      style="
                        margin: 0 0 10px;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      This code is valid for a limited time.
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      If you did not request a password reset,
                      you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 20px 40px;
                      background-color: #f9fafb;
                      border-top: 1px solid #e5e7eb;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 13px;
                      "
                    >
                      &copy; ${new Date().getFullYear()} Wazfnee.
                      All rights reserved.
                    </p>
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
